process.env.NODE_ENV = 'test';

let models = require('../models')
let EventModel = require('../models').events;
let Entity = require('../models').entities;
let User = require('../models').users;
let Permission = require('../models').permissions;
let Favorite = require('../models/').favorites;

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Add Events', () => {

    before((done) => {
        models.sequelize.sync()
        .then(() => {
            Permission.destroy({
                where: {},
                truncate: true,
                cascade: true
            });
            Entity.destroy({
                where: {},
                truncate: true,
                cascade: true
            });
            User.destroy({
                where: {},
                truncate: true,
                cascade: true
            });
            EventModel.destroy({
                where: {},
                truncate: true,
                cascade: true
            });
            Entity.create({
                id: 1,
                name: 'Test Entity',
                initials: 'TEST',
                description: 'test description'
            }).then(function(entity) {
                User.create({
                    id: 1,
                    username: 'TestUser',
                    name: 'Test User',
                    password: 'nasdasdasd',
                    email: 'email@email.com'
                }).then(function(user) {
                    user.addEntity(entity)
                    .then(() => {
                        done();
                    })
                })
                .catch((err) => {done()});
            })
            .catch((err) => {done()});
        })
    });

    afterEach((done) => {
        EventModel.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
        done();
    });

    describe('/POST Add Event', () => {
        it('it should add a new event', (done) => {

            let start_date = new Date();
            let end_date = new Date();
            start_date.setDate(start_date.getDate() + 1);
            end_date.setDate(end_date.getDate() + 2);
            let event = {
                title: "Test Event",
                description: "It is a test event, without content",
                start_date: start_date.toISOString(),
                end_date: end_date.toISOString(),
                location: "Random Location",
                price: 10,
                poster_id: 1,
                entity_id: 1
            };

            chai.request(app)
                .post('/')
                .send(event)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('description');
                    res.body.should.have.property('start_date');
                    res.body.should.have.property('end_date');
                    res.body.should.have.property('location');
                    res.body.should.have.property('price');
                    res.body.should.have.property('entity_id');
                    done();
                })
        })
    });

    describe('/POST Add Event Wrong Date', () => {
        it('it should return an error', (done) => {

            let start_date = new Date();
            let end_date = new Date();
            start_date.setDate(start_date.getDate() + 1);
            let event = {
                title: "Test Event",
                description: "It is a test event, without content",
                start_date: start_date,
                end_date: end_date,
                location: "Random Location",
                price: 10,
                poster_id: 1,
                entity_id: 1
            };

            chai.request(app)
                .post('/')
                .send(event)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                })
        })
    });

    describe('/POST Add Event With File', () => {
        it('it should save file in directory', (done) => {

            let start_date = new Date();
            let end_date = new Date();
            start_date.setDate(start_date.getDate() + 1);
            end_date.setDate(end_date.getDate() + 2);
            let event = {
                title: "Test Event",
                description: "It is a test event, without content",
                start_date: start_date,
                end_date: end_date,
                location: "Random Location",
                price: 10,
                poster_id: 1,
                entity_id: 1
            };

            chai.request(app)
                .post('/')
                .field("title", event.title)
                .field("description", event.description)
                .field("start_date", event.start_date.toISOString())
                .field("end_date", event.end_date.toISOString())
                .field("location", event.location)
                .field("price", event.price)
                .field("poster_id", event.poster_id)
                .field("entity_id", event.entity_id)
                .attach('image', './test/assets/test_image.jpg', 'image')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('description');
                    res.body.should.have.property('start_date');
                    res.body.should.have.property('end_date');
                    res.body.should.have.property('location');
                    res.body.should.have.property('price');
                    res.body.should.have.property('entity_id');
                    done();
                })
        })
    });    
});


describe('List Events', () => {

    before((done) => {
        Favorite.destroy({
            where: {},
            truncate: true,
            cascade: true
        })
        Permission.destroy({
            where: {},
            truncate: true,
            cascade: true
        })
        Entity.destroy({
            where: {},
            truncate: true,
            cascade: true
        })
        User.destroy({
            where: {},
            truncate: true,
            cascade: true
        })
        EventModel.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
        Entity.create({
            id: 1,
            name: 'Test Entity',
            initials: 'TEST',
            description: 'test description'
        }).then(function (entity) {
            User.create({
                id: 1,
                username: 'TestUser',
                name: 'Test User',
                password: 'nasdasdasd',
                email: 'email@email.com'
            }).then(function (user) {
                user.addEntity(entity)
                .then(() => {
                    let start_date = new Date();
                    start_date.setDate(start_date.getDate() + 1);
                    EventModel.create({
                        title: "Test ",
                        description: "Hello There",
                        start_date: start_date,
                        poster_id: 1,
                        entity_id: 1

                    }).then(function (event) {
                        event.addUser(user);
                        done();
                    })
                }).catch((err) => done());
            }).catch((err) => done());
        }).catch((err) => done());
    });


    describe('/GET List Events App', () => {
        it('it should list all events on the App', (done) => {

            chai.request(app)
                .get('/app')
                .query({ page: 0, limit: 10 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                })
        });
    });

    describe('/GET List Events Web', () => {
        it('it should list all events on the web', (done) => {

            chai.request(app)
                .get('/')
                .query({ page: 0, limit: 10 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                })
        });
    });


});
