const Category = require('../models').categories;

module.exports = {

    getCategories(req, res) {
        return Category.findAll({ attributes: ['id', 'name', 'name_english'] })
            .then((categories) => res.status(200).send(categories))
            .catch((err) => res.status(400).send(err));
    }

};
