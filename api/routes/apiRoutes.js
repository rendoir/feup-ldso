var express = require("express");
var router = express.Router();
const eventController = require('../controllers').event;
var middleware = require("../middleware");

router.post("/", function (req, res) {

    // TODO: Get Id from Logged In user
    var entity_id = 1;
    var poster_id = 1;

    var reqData = req;
    reqData.body.entity_id = entity_id;
    reqData.body.poster_id = poster_id;

    eventController.add(reqData, res);

});


router.get("/",function(req, res){

    eventController.listForWeb(req, res);

}); 

router.get("/app", eventController.listForUsers); 

router.get("/search/entities", eventController.searchForEntities);
router.get("/search/categories", eventController.searchForCategories);

module.exports = router;