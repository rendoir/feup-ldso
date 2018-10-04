var { Pool } = require('pg');

const pool = new Pool({
    user:'postgres',
    host:'192.168.99.100', //ALWAYS CHANGE TO LOCALHOST BEFORE MERGING WITH DEV
    database:'postgres',
    password:'example',
    port:'5432'
});

var express = require("express");
var middleware = require("../middleware");
var router = express.Router();


var NUMBER_EVENTS = 10;

// Add event
router.post("/", function (req, res) {

});

// List all events

router.get("/events/:page", function (req, res) {

    let id = req.params.page;
    let pages = id * 10;
    let today = new Date().toISOString().slice(0, 10);
    
    const query = "SELECT * FROM events WHERE events.start_date >= $1 ORDER BY events.start_date OFFSET $2 LIMIT $3";
    
    const values = [today, pages - NUMBER_EVENTS, NUMBER_EVENTS];

    pool.connect()
        .then(client => {

            console.log('connected');

            return client.query(query, values)
                .then(results => {

                    console.log("Query Successful");

                    if (results.rows.length === 0) {
                        res.statusCode = 404;
                        return res.json({ errors: ["No Events found"] })
                    }
            
                    req.events = results.rows;
                    client.release();
                    return res.json({events: req.events});
                })
                .catch(err => {
                    console.log("Error");
                    res.statusCode = 500;
                    client.release();
                    return res.json({ errors: ["No Events found"] });
                })
        })
        .catch(err => console.error('connection error', err.stack));

});


module.exports = router;