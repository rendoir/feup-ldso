
let EventModel = require('../models').events;
let Entity = require('../models').entities;
let Category = require('../models').categories;
let User = require('../models').users;
let Permission = require('../models').permissions;
let Favorite = require('../models/').favorites;

module.exports = {
    destroyDatabase() {
        Category.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
        Permission.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
        Favorite.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
        Entity.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
        User.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
        EventModel.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
    }
}
