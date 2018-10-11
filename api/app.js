var express = require('express'),
    bodyParser = require("body-parser"),
    app = express(),
    port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
var routes = require("./routes/apiRoutes");
app.use("/",routes);


app.listen(port);

module.exports = app;