var express = require("express");
var router = express.Router();
const eventController = require('../controllers').event;
const entityController = require('../controllers').entity;
const categoryController = require('../controllers').category;
var middleware = require("../middleware");

router.post("/", function (req, res) {

    // TODO: Get Id from Logged In user
    var entity_id = 1;
    var user_id = 1;

    var reqData = req;
    reqData.body.entity_id = entity_id;
    reqData.body.user_id = user_id;

    eventController.add(reqData, res);

});

router.delete("/", function (req, res) {

    // TODO: Get Id from selected event
    var user_id = 1;
    var reqData = req;
    reqData.body.user_id = user_id;

    eventController.delete(reqData, res);

});


// List events
router.get("/", eventController.listForWeb); 
router.get("/app", eventController.listForUsers); 

// Search
router.get("/search/entities", eventController.searchForEntities);
router.get("/search/categories", eventController.searchForCategories);
router.get("/search/events", eventController.searchForEvents);

// Getters
router.get("/entities", entityController.getEntitiesWithPermission);
router.get("/app/entities", entityController.getEntities);
router.get("/categories", categoryController.getCategories);
router.get("/events/categories", eventController.getEventsByCategories);

module.exports = router;