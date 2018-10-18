const Event = require('../models').events;
const Entity = require('../models').entities;
const Category = require('../models').categories;
var sequelize = require('../models').sequelize;
const Op = sequelize.Op;

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

    searchForEntities(req, res) {

        let pattern = patternToTSVector(req.query.text);

        return sequelize.query("SELECT id, initials, name, 'initials' as searched_by FROM entities WHERE to_tsvector('simple', entities.initials) @@ to_tsquery('simple', $1) UNION SELECT id, initials, name, 'name' as searched_by FROM entities WHERE to_tsvector('simple', entities.name) @@ to_tsquery('simple', $1) ORDER BY searched_by, name;",
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
            "SELECT * FROM events WHERE to_tsvector('simple', events.title) @@ to_tsquery('simple', $1);",
            { bind: [pattern], type: sequelize.QueryTypes.SELECT })

            .then((events) => res.status(200).send(events))
            .catch((error) => res.status(400).send(error));

    },

    listForWeb(req, res) {
        //1st bind parameter -> logged id 
        return sequelize.query(
            'SELECT * from events INNER JOIN permissions ON permissions.entity_id = events.entity_id  WHERE permissions.user_id = $1 AND events.start_date > current_timestamp OFFSET $2 LIMIT $3',
            { bind: [1, req.query.page, req.query.limit], type: sequelize.QueryTypes.SELECT })

            .then((events) => res.status(200).send(events))
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
            poster_id: req.body.poster_id,
            entity_id: req.body.entity_id
        })
            .then((event) => {
                try {
                    this.saveImage(req.files, event)
                    res.status(201).send(event)
                }
                catch (err) {
                    res.status(400).send(err);
                }

            })
            .catch((error) => res.status(400).send(error));
    },

    saveImage(files, event) {
        //Validate image
        if (files == null || files.image == null
            || files.image.size == 0 || !files.image.mimetype.startsWith('image'))
            return;

        //Save original image
        let path = "./assets/" + event.id;
        files.image.mv(path)
            .then(() => {
                modifyImage(path, 2);
            })
            .catch((err) => {
                throw new Error("Error saving original image: " + err);
            });
    },
}
