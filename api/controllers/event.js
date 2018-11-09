const Event = require('../models').events;
const Entity = require('../models').entities;
const Category = require('../models').categories;
var sequelize = require('../models').sequelize;
const Op = sequelize.Op;
const fs = require('fs');

function patternToTSVector(text) {

    let words = text.trim().replace(/ +(?= )/g, '').split(' ');
    let string = "";
    for (i in words) {
        string += words[i] + ":* & ";
    }
    return string.substring(0, string.length - 3);

}

module.exports = {

    listForUsers(req, res) {

        let today = Math.floor(Date.now());
        return Event.findAll({
            where: {
                start_date: {
                    [Op.gte]: today
                }
            },
            limit: req.query.limit,
            offset: req.query.page,
            order: [['start_date', 'ASC']]
        })
            .then((events) => res.status(200).send(events))
            .catch((error) => res.status(400).send(error));
    },

    getEventInfo(req, res) {
        return Event.findById(req.params.event_id, {
            include: [
                {
                    model: sequelize.models.entities,
                },
                {
                    model: sequelize.models.categories,
                }
            ]
        })
            .then((event) => res.status(200).send(event))
            .catch((error) => res.status(400).send(error));
    },

    searchForEntities(req, res) {

        let pattern = patternToTSVector(req.query.text);

        return sequelize.query(
            "WITH search_initials AS ( SELECT id, initials, name, 'initials' as searched_by FROM entities WHERE to_tsvector('simple', entities.initials) @@ to_tsquery('simple', $1)) SELECT * from search_initials " +
            "UNION SELECT id, initials, name, 'name' as searched_by FROM entities WHERE to_tsvector('simple', entities.name) @@ to_tsquery('simple', $1) AND (id, initials, name, 'initials') NOT IN (select * from search_initials) " +
            "ORDER BY searched_by, name;",
            { bind: [pattern], type: sequelize.QueryTypes.SELECT })

            .then((events) => res.status(200).send(events))
            .catch((error) => res.status(400).send(error));
    },

    searchForCategories(req, res) {

        let pattern = patternToTSVector(req.query.text);

        return sequelize.query(
            "SELECT * FROM categories WHERE to_tsvector('simple', categories.name) @@ to_tsquery('simple', $1);",
            { bind: [pattern], type: sequelize.QueryTypes.SELECT })

            .then((events) => res.status(200).send(events))
            .catch((error) => res.status(400).send(error));
    },

    searchForEvents(req, res) {

        let pattern = patternToTSVector(req.query.text);
        return sequelize.query(
            "WITH search_title AS (SELECT id, title, location, price, start_date, entity_id, 'title' as search_by FROM events WHERE to_tsvector('simple', events.title) @@ to_tsquery('simple', $1) AND start_date > current_timestamp) SELECT * FROM search_title " +
            "UNION SELECT id, title, location, price, start_date, entity_id, 'location' as search_by FROM events WHERE to_tsvector('simple', events.location) @@ to_tsquery('simple', $1) AND start_date > current_timestamp AND (id, title, location, price, start_date, entity_id, 'title') NOT IN (SELECT * FROM search_title) " +
            "ORDER BY search_by DESC, start_date ASC;",
            { bind: [pattern], type: sequelize.QueryTypes.SELECT })

            .then((events) => res.status(200).send(events))
            .catch((error) => res.status(400).send(error));

    },

    listForWeb(req, res) {
        let result = {};
        return sequelize.query('SELECT COUNT(*) FROM events INNER JOIN permissions ON permissions.entity_id = events.entity_id' +
            ' INNER JOIN entities ON "entities".id = "permissions".entity_id WHERE "permissions".user_id = $1  AND events.start_date > current_timestamp',
            { bind: [req.params.user_id], type: sequelize.QueryTypes.SELECT })
            .then((num) => {
                result.count = parseInt(num[0].count);

                return sequelize.query('SELECT events.id, events.title, events.start_date, entities.id AS entity_id, entities.initials from events INNER JOIN permissions ON permissions.entity_id = events.entity_id' +
                    ' INNER JOIN entities ON "entities".id = "permissions".entity_id WHERE "permissions".user_id = $1  AND events.start_date > current_timestamp OFFSET $2 LIMIT $3',
                    { bind: [req.params.user_id, req.query.page, req.query.limit], type: sequelize.QueryTypes.SELECT })
                    .then((events) => {
                        result.events = events;
                        return res.status(200).send(result);
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));

    },

    add(req, res) {
        return Event.create({
            title: req.body.title,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            location: req.body.location,
            price: req.body.price,
            user_id: req.body.user_id,
            entity_id: req.body.entity_id
        })
            .then((event) => {
                event.setCategories(req.body.categories.split(','))
                    .then(() => {
                        try {
                            this.saveImage(req.files, event)
                            res.status(201).send(event)
                        }
                        catch (err) {
                            res.status(400).send(err);
                        }
                    })
                    .catch((error) => res.status(400).send(error));

            })
            .catch((error) => res.status(400).send(error));
    },

    delete(req, res) {

        return Event.destroy({
            where: { id: req.body.id }
        })
            .then(() => {
                fs.unlink('assets/' + req.body.id, () => {});
                res.status(200).send({ message: "The event was successfully deleted!" });
            })
            .catch((error) => res.status(400).send(error));
    },

    saveImage(files, event) {
        //Validate image
        if (files == null || files.image == null
            || files.image.size == 0 || !files.image.mimetype.startsWith('image'))
            return;

        //Save image
        let path = "./assets/" + event.id;
        files.image.mv(path)
            .catch((err) => {
                throw new Error("Error saving original image: " + err);
            });
    },

    /**
     * Returns events based on optional filters and options
     * @param {array, integer} entities 
     * @param {array, integer} categories
     * @param {boolean} past
     * @param {integer} limit
     * @param {integer} page
     */
    getEvents(req, res) {
        let query_options = {};
        query_options.where = {};
        query_options.include = [];

        // Shouldn't include past events
        if (!req.query.past) {
            let today = Math.floor(Date.now());
            query_options.where.start_date = { [Op.gte]: today };
        }

        // Set pagination settings
        if (req.query.limit) query_options.limit = req.query.limit;
        if (req.query.offset) query_options.offset = req.query.page;
        query_options.order = [['start_date', 'ASC']];

        // Filter entities
        if (req.query.entities) {
            query_options.where.entity_id = Array.isArray(req.query.entities) ? { [Op.or]: req.query.entities } : req.query.entities;
            query_options.include.push(sequelize.models.entities);
        }

        // Filter categories
        if (req.query.categories) {
            query_options.include.push({
                model: sequelize.models.categories,
                required: true,
                where: {
                    id: Array.isArray(req.query.categories) ? { [Op.or]: req.query.categories } : req.query.categories
                }
            });
        }

        return Event.findAll(query_options)
            .then((events) => res.status(200).send(events))
            .catch((error) => res.status(400).send(error));
    }

}
