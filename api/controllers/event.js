const Event = require('../models').events;
const Favorite = require('../models').favorites;
var sequelize = require('../models').sequelize;
const User = require('./user');
const Op = sequelize.Op;
const fs = require('fs');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.js')[env];

function patternToTSVector(text) {

    let words = text.trim().replace(/ +(?= )/g, '').split(' ');
    let string = "";
    for (let i in words) {
        string += words[i] + ":* & ";
    }
    return string.substring(0, string.length - 3);

}

function getEventInfoFunction(event_id, status_code_success, res) {
    return Event.findById(event_id, {
        include: [
            {
                model: sequelize.models.entities
            },
            {
                model: sequelize.models.categories
            }
        ]
    })
        .then((event) => res.status(status_code_success).send(event))
        .catch((error) => res.status(400).send(error));
}

module.exports = {

    getEventInfo(req, res) {
        return getEventInfoFunction(req.params.event_id, 200, res);
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
        // Check if user token matches
        let user_id = req.query.user_id;
        let token = req.query.token;
        User.searchToken(token, user_id).then((users) => {
            if (!User.tokenHasMatch(users) || !token)
                return res.status(401).send();

            let pattern = patternToTSVector(req.query.text);

            return sequelize.query(
                `WITH full_search AS ( WITH search_title_desc_category AS ( WITH search_title_desc AS ( WITH search_title AS ( 
                    SELECT events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'title' AS search_by, '1' AS priority FROM events JOIN entities ON entities.id = events.entity_id WHERE to_tsvector('simple', events.title_english) @@ to_tsquery('simple', $1) AND (start_date > CURRENT_TIMESTAMP OR end_date > CURRENT_TIMESTAMP)) SELECT * FROM search_title UNION 
                    SELECT events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'description' AS search_by, '2' AS priority FROM events JOIN entities ON entities.id = events.entity_id WHERE to_tsvector('simple', events.description_english) @@ to_tsquery('simple', $1) AND (start_date > CURRENT_TIMESTAMP OR end_date > CURRENT_TIMESTAMP) AND (events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'title', '1') NOT IN ( SELECT * FROM search_title)) SELECT * FROM search_title_desc UNION 
                    SELECT events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'category' AS search_by, '3' AS priority FROM events JOIN event_categories ON event_categories.event_id = events.id JOIN categories ON event_categories.event_id = categories.id JOIN entities ON entities.id = events.entity_id WHERE to_tsvector('simple', categories.name_english) @@ to_tsquery('simple', $1) AND (start_date > CURRENT_TIMESTAMP OR end_date > CURRENT_TIMESTAMP) AND (events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'title', '1') NOT IN ( SELECT * FROM search_title_desc) AND (events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'description', '2') NOT IN ( SELECT * FROM search_title_desc)) SELECT * FROM search_title_desc_category UNION 
                    SELECT events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'location' AS search_by, '4' AS priority FROM events JOIN entities ON entities.id = events.entity_id WHERE to_tsvector('simple', events.location) @@ to_tsquery('simple', $1) AND start_date > CURRENT_TIMESTAMP AND (events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'title', '1') NOT IN ( SELECT * FROM search_title_desc_category) AND (events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'description', '2') NOT IN ( SELECT * FROM search_title_desc_category) AND (events.id, events.title, events.title_english, events.description, events.description_english, events.location, price, start_date, end_date, events.entity_id, entities.initials, 'category', '3') NOT IN ( SELECT * FROM search_title_desc_category) 
                    ORDER BY priority ASC, start_date ASC ) 
                    SELECT full_search.*, CASE user_id WHEN 1 THEN TRUE ELSE FALSE END AS is_favorite FROM full_search LEFT OUTER JOIN favorites ON favorites.event_id = full_search.id AND favorites.user_id = $2;`,
                { bind: [pattern, req.query.user_id], type: sequelize.QueryTypes.SELECT })

                .then((events) => res.status(200).send(events))
                .catch((error) => res.status(400).send(error));
        });
    },

    searchForEventsByTextWeb(req, res) {

        if (req.user === undefined) {
            return res.status(400).send("You don't have permissions to make this request");
        }

        let result = {};
        let pattern = patternToTSVector(req.query.text);

        return sequelize.query(
            "WITH search_title_desc AS ( " +
            "WITH search_title AS ( " +
            "SELECT events.id, title, title_english, events.description, events.description_english, location, price, start_date, end_date, entity_id, 'title' as search_by, '1' as priority " +
            "FROM events WHERE to_tsvector('simple', events.title) @@ to_tsquery('simple', $1) AND (start_date > current_timestamp OR end_date > current_timestamp) ) SELECT * FROM search_title UNION " +
            "SELECT events.id, title, title_english, events.description, events.description_english, location, price, start_date, end_date, entity_id, 'description' as search_by, '2' as priority " +
            "FROM events WHERE to_tsvector('simple', events.description) @@ to_tsquery ('simple', $1) AND (start_date > current_timestamp OR end_date > current_timestamp) AND (events.id, title, title_english, events.description, events.description_english, location, price, start_date, end_date, entity_id, 'title', '1') NOT IN (SELECT * FROM search_title) ORDER BY priority ASC, start_date ASC) " +
            "SELECT search_title_desc.*, entities.initials FROM search_title_desc INNER JOIN permissions ON permissions.entity_id = search_title_desc.entity_id AND permissions.user_id = $2 LEFT JOIN entities ON search_title_desc.entity_id = entities.id",
            { bind: [pattern, req.user.id], type: sequelize.QueryTypes.SELECT })
            .then((events) => {

                result.count = events.length;
                let subArray = events.slice(req.query.page, events.length);

                if (subArray.length === 0) {
                    result.rows = [];
                } else if (subArray.length >= req.query.limit) {
                    result.rows = subArray.slice(0, req.query.limit);
                } else {
                    result.rows = subArray;
                }
                return res.status(200).send(result);

            })
            .catch((error) => res.status(400).send(error));
    },


    add(req, res) {
        if (req.body.end_date == "") {
            return Event.create({
                title: req.body.title,
                title_english: req.body.title_english,
                description: req.body.description,
                description_english: req.body.description_english,
                start_date: req.body.start_date,
                location: req.body.location,
                price: req.body.price,
                user_id: req.body.user_id,
                entity_id: req.body.entity_id
            })
                .then((event) => {
                    event.setCategories(req.body.categories.split(','))
                        .then(() => {
                            try {
                                this.saveImage(req.files, event);
                                res.status(201).send(event);
                            } catch (err) {
                                res.status(400).send(err);
                            }
                        })
                        .catch((error) => res.status(400).send(error));

                })
                .catch((error) => res.status(400).send(error));
        }
        return Event.create({
            title: req.body.title,
            title_english: req.body.title_english,
            description: req.body.description,
            description_english: req.body.description_english,
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
                            this.saveImage(req.files, event);
                            res.status(201).send(event);
                        } catch (err) {
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
                fs.unlink('assets/' + req.body.id, () => { });
                res.status(200).send({ message: "The event was successfully deleted!" });
            })
            .catch((error) => res.status(400).send(error));
    },

    edit(req, res) {
        if (req.body.end_date == 'null') {
            return Event.update(
                {
                    title: req.body.title,
                    title_english: req.body.title_english,
                    description: req.body.description,
                    description_english: req.body.description_english,
                    start_date: req.body.start_date,
                    location: req.body.location,
                    price: req.body.price,
                    user_id: req.body.user_id,
                    entity_id: req.body.entity_id
                },
                {
                    returning: true,
                    where: { id: req.params.event_id }
                })
                .then(([updatedRows, [updatedEvent]]) => {
                    updatedEvent.setCategories(req.body.categories.split(','))
                        .then(() => {
                            if (updatedRows !== 1)
                                res.status(400).send("There was a problem editing this event. Please try again later.");
                            try {

                                this.saveImage(req.files, updatedEvent);
                                getEventInfoFunction(req.params.event_id, 201, res);

                            } catch (err) {
                                res.status(400).send(err);
                            }
                        })
                        .catch((error) => res.status(400).send(error));

                })
                .catch(() => res.status(400).send("There was a problem editing this event. Please try again later."));
        }
        return Event.update(
            {
                title: req.body.title,
                title_english: req.body.title_english,
                description: req.body.description,
                description_english: req.body.description_english,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                location: req.body.location,
                price: req.body.price,
                user_id: req.body.user_id,
                entity_id: req.body.entity_id
            },
            {
                returning: true,
                where: { id: req.params.event_id }
            })
            .then(([updatedRows, [updatedEvent]]) => {
                updatedEvent.setCategories(req.body.categories.split(','))
                    .then(() => {
                        if (updatedRows !== 1)
                            res.status(400).send("There was a problem editing this event. Please try again later.");
                        try {

                            this.saveImage(req.files, updatedEvent);
                            getEventInfoFunction(req.params.event_id, 201, res);

                        } catch (err) {
                            res.status(400).send(err);
                        }
                    })
                    .catch((error) => res.status(400).send(error));

            })
            .catch(() => res.status(400).send("There was a problem editing this event. Please try again later."));
    },

    saveImage(files, event) {
        // Validate image
        if (files == null || files.image == null
            || files.image.size == 0 || !files.image.mimetype.startsWith('image'))
            return;
        // Save image
        let path = config.assertsDir + "/assets/" + event.id;
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

        // Check if user token matches
        let user_id = req.query.user_id;
        let token = req.query.token;
        User.searchToken(token, user_id).then((users) => {
            if (!User.tokenHasMatch(users) || !token)
                return res.status(401).send();

            query_options = module.exports.filterOfQueryOptions(req, query_options);

            // Get favorite boolean
            query_options.include.push({
                model: sequelize.models.users,
                as: 'favorite',
                where: {
                    id: user_id
                },
                attributes: ["id"],
                required: false
            });

            return Event.findAll(query_options)
                .then((events) => res.status(200).send(events))
                .catch((error) => res.status(400).send(error));
        });
    },

    getEventsWeb(req, res) {
        let query_options = {};
        query_options.where = {};
        query_options.include = [];

        req.query.permissions = true;
        query_options = module.exports.filterOfQueryOptions(req, query_options);

        query_options.include.push({
            model: sequelize.models.entities,
            required: true,
            include: {
                model: sequelize.models.users,
                required: true,
                where: {
                    id: req.user.id
                }
            }
        });
        query_options.distinct = true;

        return Event.findAndCountAll(query_options)
            .then((result) => res.status(200).send(result))
            .catch((error) => res.status(400).send(error));
    },

    listFavorites(req, res) {
        let query_options = {};
        query_options.where = {};
        query_options.include = [];

        // Check if user token matches
        let user_id = req.query.user_id;
        let token = req.query.token;
        User.searchToken(token, user_id).then((users) => {
            if (!User.tokenHasMatch(users) || !token)
                return res.status(401).send();

            query_options = module.exports.filterOfQueryOptions(req, query_options);

            query_options.include.push({
                model: sequelize.models.users,
                as: 'favorite',
                where: {
                    id: user_id
                },
                attributes: ["id"],
                required: true
            });

            return Event.findAll(query_options)
                .then((events) => res.status(200).send(events))
                .catch((error) => res.status(400).send(error));
        });
    },

    filterOfQueryOptions(req, query_options) {
        let query_opts = query_options;
        // Shouldn't include past events
        if (!req.query.past) {
            let today = Math.floor(Date.now());
            query_options.where = {
                [Op.or]: [
                    { start_date: { [Op.gte]: today } },
                    {
                        start_date: { [Op.lt]: today },
                        end_date: { [Op.gte]: today }
                    }
                ]
            };
        }

        // Set pagination settings
        if (req.query.limit) query_options.limit = req.query.limit;
        if (req.query.offset) query_options.offset = req.query.offset;
        query_options.order = [['start_date', 'ASC'], ['id', 'ASC']];

        // Filter entities
        if (req.query.entities) {
            query_options.where.entity_id = Array.isArray(req.query.entities) ? { [Op.or]: req.query.entities } : req.query.entities;
            if (!req.query.permissions) {
                query_options.include.push(sequelize.models.entities);
            }
        } else {
            if (!req.query.permissions) {
                query_options.include.push(sequelize.models.entities);
            }
        }

        // Filter categories
        if (req.query.categories) {
            query_opts.include.push({
                model: sequelize.models.categories,
                required: true,
                where: {
                    id: Array.isArray(req.query.categories) ? { [Op.or]: req.query.categories } : req.query.categories
                }
            });
        } else {
            query_options.include.push({
                model: sequelize.models.categories
            });
        }
        return query_opts;
    },

    isEventFavorited(event_id, user_id) {
        let query_options = {};
        query_options.where = {
            user_id: user_id,
            event_id: event_id
        };

        return Favorite.count(query_options);
    },

    toggleFavorite(req, res) {
        let event_id = req.body.event_id;
        let user_id = req.body.user_id;
        let token = req.body.token;

        User.searchToken(token, user_id).then((users) => {
            if (!User.tokenHasMatch(users) || !token)
                return res.status(401).send();

            module.exports.isEventFavorited(event_id, user_id)
                .then((count) => {
                    let has_favorite = count > 0;

                    // Remove favorite
                    if (has_favorite) {
                        let query_options = {};
                        query_options.where = {
                            user_id: user_id,
                            event_id: event_id
                        };
                        return Favorite.destroy(query_options)
                            .then(() => res.status(200).send({ message: "The event was removed from your favorites!" }))
                            .catch((error) => res.status(400).send(error));
                    } else { // Add favorite
                        return Favorite.create({
                            user_id: user_id,
                            event_id: event_id
                        })
                            .then(() => res.status(200).send({ message: "The event was added to your favorites!" }))
                            .catch((error) => res.status(400).send(error));
                    }
                })
                .catch((error) => res.status(400).send(error));
        });
    }

};
