const Category = require('../models').categories;
var sequelize = require('../models').sequelize;
const Op = sequelize.Op;

module.exports = {

    getCategories(req, res) {
        return Category.findAll({ attributes: ['id', 'name'] })
            .then((categories) => res.status(200).send(categories))
            .catch((err) => res.status(400).send(err));
    }

}
