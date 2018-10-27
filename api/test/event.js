process.env.NODE_ENV = 'test';

let models = require('../models');
let EventModel = require('../models').events;
let Entity = require('../models').entities;
let Category = require('../models').categories;
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
                Category.destroy({
                    where: {},
                    truncate: true,
                    cascade: true
                })
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
                        email: 'email@email.com',
                        type: 'moderator'
                    }).then(function (user) {
                        user.addEntity(entity)
                            .then(() => {
                                Category.create({
                                    id: 1,
                                    name: 'TestCat',
                                    description: 'description'
                                }).then(() => done())
                                    .catch((err) => done())
                            })
                    })
                        .catch((err) => { done() });
                })
                    .catch((err) => { done() });
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
                user_id: 1,
                entity_id: 1,
                categories: '1'
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
                    res.body.should.have.property('user_id');
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
                user_id: 1,
                entity_id: 1,
                categories: '1'
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
                title: "Test Event22",
                description: "It is a test event, without content",
                start_date: start_date.toISOString(),
                end_date: end_date.toISOString(),
                location: "Random Location",
                price: 10,
                user_id: 1,
                entity_id: 1,
                categories: '1'
            };

            chai.request(app)
                .post('/')
                .field("title", event.title)
                .field("description", event.description)
                .field("start_date", event.start_date)
                .field("end_date", event.end_date)
                .field("location", event.location)
                .field("price", event.price)
                .field("user_id", event.user_id)
                .field("entity_id", event.entity_id)
                .field("categories", event.categories)
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
        }).then((entity) => {
            User.create({
                id: 1,
                username: 'TestUser',
                name: 'Test User',
                password: 'nasdasdasd',
                email: 'email@email.com',
                type: 'moderator'
            }).then(function (user) {
                user.addEntity(entity)
                    .then(() => {
                        let start_date = new Date();
                        start_date.setDate(start_date.getDate() + 1);
                        EventModel.create({
                            title: "Test ",
                            description: "Hello There",
                            start_date: start_date,
                            user_id: 1,
                            entity_id: 1,

                        }).then((event) => {
                            event.setUser(user).then(() => done());
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
                .get('/1')
                .query({ page: 0, limit: 5 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                })
        });
    });
});


describe('Delete Events', () => {

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
                    username: 'TestUser',
                    name: 'Test User',
                    password: 'nasdasdasd',
                    email: 'email@email.com',
                    type: 'moderator'
                }).then((user) => {
                    user.addEntity(entity)
                        .then(() => {
                            let start_date = new Date();
                            let end_date = new Date();
                            start_date.setDate(start_date.getDate() + 1);
                            end_date.setDate(end_date.getDate() + 2);
                            EventModel.create({
                                id: 1,
                                title: "Delete Event Test",
                                description: "It is a test event, without content",
                                start_date: start_date.toISOString(),
                                end_date: end_date.toISOString(),
                                location: "Random Location",
                                price: 10,
                                user_id: 1,
                                entity_id: 1
                            }).then(() => done());
                        }).catch((err) => done());
                }).catch((err) => { done() });
            }).catch((err) => { done() });
    })

    describe('/DELETE Delete Event', () => {
        it('it should delete a events on the web', (done) => {

            chai.request(app)
                .delete('/')
                .send({ id: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                })
        })
    });
});

function destroyDatabase() {
    Category.destroy({
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
}

describe('Filter events', () => {

    before((done) => {
        destroyDatabase();
        // Create entities
        Entity.bulkCreate([
            {
                id: 1,
                name: 'Test Entity 1',
                initials: 'TEST1'
            },
            {
                id: 2,
                name: 'Test Entity 2',
                initials: 'TEST2'
            },
            {
                id: 3,
                name: 'Test Entity 3',
                initials: 'TEST3'
            }
        ]).then(() =>
            // Create categories
            Category.bulkCreate([
                {
                    id: 1,
                    name: 'Test Category 1'
                },
                {
                    id: 2,
                    name: 'Test Category 2'
                },
                {
                    id: 3,
                    name: 'Test Category 3'
                }
            ]).then(() => { return Entity.findAll() })
                .then((entities) =>
                    // Create user
                    User.create({
                        id: 1,
                        username: 'TestUser',
                        name: 'Test User',
                        password: 'nasdasdasd',
                        email: 'email@email.com',
                        type: 'moderator'
                    }).then((user) => user.setEntities(entities)) // Give full permissions to user
                        .then(() => {
                            let start_date = new Date();
                            start_date.setDate(start_date.getDate() + 1);
                            // Create events
                            EventModel.bulkCreate([
                                {
                                    id: 1,
                                    title: "Test 1",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 1
                                },
                                {
                                    id: 2,
                                    title: "Test 2",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 2
                                },
                                {
                                    id: 3,
                                    title: "Test 3",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 2
                                },
                                {
                                    id: 4,
                                    title: "Test 4",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 3
                                },
                                {
                                    id: 5,
                                    title: "Test 5",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 3
                                },
                                {
                                    id: 6,
                                    title: "Test 6",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 3
                                }
                            ])
                                // Add category 1 to event 1
                                .then(() => Category.findByPrimary(1)
                                    .then((category) => EventModel.findByPrimary(1)
                                        .then((event) => event.addCategory(category)
                                        )))
                                // Add category 1 and 3 to event 2
                                .then(() => Category.findAll({ where: { id: { [models.sequelize.Op.or]: [1, 3] } } })
                                    .then((categories) => EventModel.findByPrimary(2)
                                        .then((event) => event.setCategories(categories)
                                        )))
                                // Add category 2 to event 4
                                .then(() => Category.findByPrimary(2)
                                    .then((category) => EventModel.findByPrimary(4)
                                        .then((event) => event.addCategory(category)
                                        )))
                                .then(() => done())
                        })
                )
        )
    });

    describe('/GET Filter events by categories', () => {
        it('It should filter events by categories', (done) => {
            chai.request(app)
                .get('/events')
                .query({ categories: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                })
        });
    });

    describe('/GET Filter events by entities', () => {
        it('It should filter events by entities', (done) => {
            chai.request(app)
                .get('/events')
                .query({ entities: [2, 3] })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(5);
                    done();
                })
        });
    });

    describe('/GET Filter events by categories and entities', () => {
        it('It should filter events by categories and entities', (done) => {
            chai.request(app)
                .get('/events')
                .query({ categories: 1, entities: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                })
        });
    });
});