var { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:example@localhost:5432/postgres';

const client = new Client(connectionString);

var express = require("express");
var middleware = require("../middleware");
var router = express.Router();

client.connect();

var NUMBER_EVENTS = 10;

// Add event
router.post("/", function (req, res) {

});

// List all events

router.get("/events/:page", function(req,res) {

     //SELECT * FROM events WHERE events.start_date >= '2018-10-01' ORDER BY events.start_date OFFSET 0 LIMIT 10;
    let id = req.params.page;
    let pages = id * 10;
    let today = new Date().toISOString().slice(0,10);

    const query = "SELECT * FROM events WHERE events.start_date >= ? ORDER BY events.start_date OFFSET ? LIMIT ?";
    const values = [today, pages - NUMBER_EVENTS, NUMBER_EVENTS];

    client.connect();

    client.query(query, values, (err,results) => {
        
        if(err){
            console.log("Error");
            res.statusCode = 500;
            return res.json({errors: ["No Events found"]});
        }
        
        if(results.rows.length === 0){
            res.statusCode = 404;
            return res.json({ errors: ["No Events found"]})
        }

        req.events = results.rows;
        next();

    });

    client.end();

});


module.exports = router;