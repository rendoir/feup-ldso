var express = require("express");
var middleware = require("../middleware");
var router = express.Router();

var event_controller = require("../controllers/EventController");

router.get("/", function(req, res) {

});
  
router.post("/addEvent", function(req, res) {
    if(event_controller.isValidEvent(req.body))
        event_controller.addEvent(req.body);
    res.send();
});

module.exports = router;