var express = require("express");
var router = express.Router();
var passport = require('passport');

const eventController = require('../controllers').event;
const entityController = require('../controllers').entity;
const categoryController = require('../controllers').category;
const userController = require('../controllers').user;

// Authentication
router.post("/login", (req, res) => {
    passport.authenticate('local', (err, token, info) => {
        if (err) {
            return res.status(400).send(err);
        }
        if (info.errors) {
            return res.status(401).send(info.errors);
        } else {
            req.logIn(info, (err) => {
                if (err) {
                    return res.status(401).send(err);
                }
                return res.status(200).send({ token, info });
            });
        }
    })(req, res);
});

router.post("/app/login", async(req, res) => {
    let user = await userController.appLogIn(req.body);
    if (!isNaN(user))
        return res.status(200).send({ accessToken: req.body.accessToken, userId: user });
    else
        return res.status(400).send({ err: user });
});

router.post('/logout', (req, res) => {
    req.logout();

    return res.status(200).send({ message: 'Logged out successfully' });
});

router.post("/", passport.authenticate('jwt', { session: false }), function(req, res) {

    if (req.user === undefined) {
        return res.status(400).send("You don't have permissions to make this request");
    }

    var user_id = req.user.id;

    var reqData = req;
    reqData.body.user_id = user_id;

    eventController.add(reqData, res);

});

router.delete("/", passport.authenticate('jwt', { session: false }), function(req, res) {

    if (req.user === undefined) {
        return res.status(400).send("You don't have permissions to make this request");
    }

    var user_id = req.user.id;
    var reqData = req;
    reqData.body.user_id = user_id;

    eventController.delete(reqData, res);

});

// Search
router.get("/search/entities", eventController.searchForEntities);
router.get("/search/categories", eventController.searchForCategories);
router.get("/search/events", eventController.searchForEvents);

// Getters
router.get("/entities/:user_id", entityController.getEntitiesWithPermission);
router.get("/app/entities", entityController.getEntities);
router.get("/categories", categoryController.getCategories);

// Setters
router.post("/favorite", eventController.toggleFavorite);

// Filter events
router.get("/events", eventController.getEvents);
router.get("/events/favorites", eventController.listFavorites);
router.get("/events/:event_id", eventController.getEventInfo);

// List events
router.get("/app", eventController.listForUsers);
router.get("/web", passport.authenticate('jwt', { session: false }), eventController.listForWeb);


module.exports = router;
