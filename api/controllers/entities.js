var sequelize = require('../models').sequelize;
var Entity = require('../models').entities;
const Op = sequelize.Op;

module.exports = {

    searchbyNames(req, res) {
        return Entity.findAll({
            where: {
                [Op.or]: [
                  { 'name': { like: '%' + req.query.search + '%' } },
                  { 'initials': { like: req.query.search + '%' } }
                ]
              }
        })
    }

}