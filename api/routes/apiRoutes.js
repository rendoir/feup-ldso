var express = require("express");
var middleware = require("../middleware");
var router = express.Router();

var NUMBER_EVENTS = 10;

const {Client} = require("pg");
const client = new Client();

client.connect();

// Add event
router.post("/", function(req, res) {

});

// List all events
router.get("/events/:page", function(req, res) {

    if (err){
        console.log("error showing events");
    }
    else{
        let id = req.param.version;
        let pages = id * NUMBER_EVENTS;
        let today = Date.now();
        const query = "SELECT * FROM event WHERE event.start >= " + today + "ORDER BY event.start ASC OFFSET " 
                      + pages-NUMBER_EVENTS + "LIMIT " + NUMBER_EVENTS;

        client.query(text, (err, res) => {

            if (err) {
                console.log(err.stack);
            } else {
                console.log(res.rows[0]);
            }
        })
        
    }
});


module.exports = router;