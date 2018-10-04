var express = require("express");
var config = require('config');
var middleware = require("../middleware");

var { Pool } = require('pg');
var dbConfig = config.get('DBConfig');

const pool = new Pool(dbConfig);
var router = express.Router();

// Add event
router.post("/", function (req, res) {

    let title = req.body.title;
    let description = req.body.description;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;
    let image_path = req.body.image_path;
    let price = req.body.price;
    let location = req.body.location;
    let lat = 0.12
    let lng = 18.0;

    // TODO: Get Id from Logged In user
    var entity_id = 2;

    // Add to database
    var textQuery = "INSERT INTO events (title, description, start_date, end_date, image_path, location, latitude, longitude, price) " +
        "VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)";

    var valuesQuery = [title, description, start_date, end_date, image_path, location, lat, lng, price];

    pool.connect()
        .then(client => {
            console.log('connected');
            return client.query(textQuery, valuesQuery)
                .then(result => {
                    console.log("Success");
                    client.release();
                    return res.json({ msg: "Event successfully added to database!" });
                })
                .catch(e => {
                    console.log("Error: " + e);
                    client.release();
                    return res.json({ msg: "Error!" });
                });
        })
        .catch(err => console.error('connection error', err.stack));

});


module.exports = router;