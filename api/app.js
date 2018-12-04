var express = require('express'),
    bodyParser = require("body-parser"),
    fileUpload = require('express-fileupload'),
    passport = require('passport'),
    app = express(),
    cors = require('cors');

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config/config.js')[env];

var passportSetup = require('./passport/passport');
var port = process.env.PORT || 3030;

var openAPI = require('./openAPI');
openAPI.init(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());
app.use(express.static(config.assertsDir + '/assets'));
app.use(passport.initialize());

var routes = require("./routes/apiRoutes");
app.use("/", routes);

passportSetup();

app.listen(port);

module.exports = app;

