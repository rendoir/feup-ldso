var express = require("express");
var router = express.Router();
const eventController = require('../controllers').event;
var middleware = require("../middleware");


router.get("/",function(req, res){

    eventController.listForWeb(req, res);

}); 

router.get("/app", eventController.listForUsers); 


module.exports = router;