const Event = require('../models').events;
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.js')[env];
var sequelize = new Sequelize(config.database, config.user, config.password, config);

const Op = Sequelize.Op;

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

    listForWeb(req, res) {
        //1st bind parameter -> logged id 
        return sequelize.query('SELECT * from events INNER JOIN permissions ON permissions.entity_id = events.entity_id  WHERE "permissions".user_id = $1 AND events.start_date > current_timestamp OFFSET $2 LIMIT $3',
                    { bind: [1, req.query.page, req.query.limit], type: sequelize.QueryTypes.SELECT })
                       
            .then((events) => res.status(200).send(events))
            .catch((error) => res.status(400).send(error));

    },

    update(req, res) {

    },

    delete(req, res) {

    },

}
