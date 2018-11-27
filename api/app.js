var express = require('express'),
    bodyParser = require("body-parser"),
    fileUpload = require('express-fileupload'),
    passport = require('passport'),
    app = express(),
    cors = require('cors');

var passportSetup = require('./passport/passport');
var port = process.env.PORT || 3030;

var openAPI = require('./openAPI');

openAPI.init(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());
app.use(express.static(__dirname + '/assets'));
app.use(passport.initialize());

var routes = require("./routes/apiRoutes");
app.use("/", routes);

passportSetup();

app.listen(port);

module.exports = app;

