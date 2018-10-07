const Event = require('../models').events;

module.exports = {

    list(req, res) {
        return Event.findAll({
            limit: req.query.limit,
            offset: req.query.page,
            order: [['start_date', 'ASC']]
        })
            .then((events) => res.status(200).send(events))
            .catch((error) => res.status(400).send(error));
    },

    getById(req, res) {
        return Event.findById(req.params.id)
            .then((event) => {
                if(!event) {
                    return res.status(404).send({
                        message: 'Event Not Found'
                    });
                }
                return res.status(200).send(event);
            })
            .catch((error) => res.status(400).send(error));

    },

    add(req, res) {
        return Event.create({
            title: req.body.title,
            description: req.body.description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            image_path: req.body.image_path,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            location: req.body.location,
            price: req.body.price,
            entity_id: req.body.entity_id
        })
        .then((event) => res.status(201).send(event))
        .catch((error) => res.status(400).send(error));

    },

    update(req, res) {

    },

    delete(req, res) {

    }

}