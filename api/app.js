var express = require('express'),
    bodyParser = require("body-parser"),
    fileUpload = require('express-fileupload'),
    app = express(),
    cors = require('cors'),
    port = process.env.PORT || 3030;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());
app.use(express.static(__dirname + '/assets'));

//Routes
var routes = require("./routes/apiRoutes");
app.use("/", routes);

app.listen(port);

module.exports = app;


