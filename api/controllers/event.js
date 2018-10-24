const Event = require('../models').events;
const Entity = require('../models').entities;
const Category = require('../models').categories;
var sequelize = require('../models').sequelize;
const Op = sequelize.Op;

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
            try {
                this.saveImage(req.files, event)
                res.status(201).send(event)
            }
            catch(err) {
                res.status(400).send(err);
            }
            
        })
        .catch((error) => res.status(400).send(error));
    },

    delete(req, res){
       return Event.destroy({
            where: {id : req.body.id}
        })
        .then(() => {
            console.log("Event " + req.body.id + " deleted!");
            res.status(200).send({message: "The event was successfully deleted!"});
        })
        .catch((error) => res.status(400).send(error));
    },

    saveImage(files, event) {
        //Validate image
        if(files == null || files.image == null 
          || files.image.size == 0 || !files.image.mimetype.startsWith('image'))
            return;
        
        //Save image
        let path = "./assets/" + event.id;
        files.image.mv(path)
        .catch((err) => {
              throw new Error("Error saving original image: " + err);            
        });    
    },

    searchEntities(req, res) {
        if(Array.isArray(req.query.entities)){
            return Event.findAll({
                where: {
                    entity_id: {
                        [Op.or]: req.query.entities
                    }
                },
                include: [sequelize.models.entities],
                order: [['start_date', 'ASC']]
            })
            .then((events) => res.status(200).send(events))
            .catch((err) => res.status(400).send(err));
        }
        else {
            
            return Event.findAll({
                where: {
                    entity_id: req.query.entities
                },
                include: [sequelize.models.entities],
                order: [['start_date', 'ASC']]
            })
            .then((events) => res.status(200).send(events))
            .catch((err) => res.status(400).send(err));
        }
    },

    getEventsByCategories(req, res) {
        // Request must define "categories". It can define "limit" and "page".
        let today = Math.floor(Date.now());

        let query_options = {};
        query_options.where = {
            start_date: { [Op.gte]: today }
        };
         
        if(req.query.limit  !== undefined) query_options.limit  = req.query.limit;
        if(req.query.offset !== undefined) query_options.offset = req.query.page;

        query_options.order = [['start_date', 'ASC']];
        query_options.include = [ { 
            model: sequelize.models.categories,
            required: true,
            where: {
                id: Array.isArray(req.query.categories) ? 
                    { [Op.or]: req.query.categories } : 
                    req.query.categories
            }
        } ];
    
        return Event.findAll(query_options)
        .then((events) => res.status(200).send(events))
        .catch((error) => res.status(400).send(error));
    }
}
