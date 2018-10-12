var express = require("express");
var router = express.Router();
const eventController = require('../controllers').event;
var middleware = require("../middleware");

// Add event
router.post("/", function (req, res) {

    // TODO: Get Id from Logged In user
    var entity_id = 1;
    var poster_id = 1;

    var reqData = req;
    reqData.body.entity_id = entity_id;
    reqData.body.poster_id = poster_id;

    eventController.add(reqData, res);

});

router.get("/",/* middleware.isLoggedIn ,*/ function(req, res){

    eventController.listForWeb(req, res);

}); 

router.get("/app", eventController.listForUsers); 


module.exports = router;