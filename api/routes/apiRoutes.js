var express = require("express");
var router = express.Router();
const eventController = require('../controllers').event;
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

// List events
router.get("/", eventController.listForWeb); 
router.get("/app", eventController.listForUsers); 

// Search for events
router.get("/search", eventController.searchEntities);

module.exports = router;