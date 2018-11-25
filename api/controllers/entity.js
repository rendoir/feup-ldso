const Entity = require('../models').entities;
var sequelize = require('../models').sequelize;
const Op = sequelize.Op;

module.exports = {

    searchbyNames(req) {
        return Entity.findAll({
            where: {
                [Op.or]: [
                    { 'name': { like: '%' + req.query.search + '%' } },
                    { 'initials': { like: req.query.search + '%' } }
                ]
            }
        });
    },

    getEntities(req, res) {
        return Entity.findAll({
            attributes: ['id', 'initials']
        })
            .then((entities) => res.status(200).send(entities))
            .catch((err) => res.status(400).send(err));
    },

    getEntitiesWithPermission(req, res) {
        return sequelize.query('SELECT entities.id, entities.initials from permissions INNER JOIN users ON permissions.user_id = users.id INNER JOIN entities ON entity_id = entities.id WHERE permissions.user_id = $1',
            { bind: [req.user.id], type: sequelize.QueryTypes.SELECT })
            .then((entities) => res.status(200).send(entities))
            .catch((err) => res.status(400).send(err));
    }

};
