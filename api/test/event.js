process.env.NODE_ENV = 'test';

let models = require('../models');
let EventModel = require('../models').events;
let Entity = require('../models').entities;
let Category = require('../models').categories;
let User = require('../models').users;

let Common = require('./common');

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');

chai.use(chaiHttp);
describe('Add Events', () => {

    before((done) => {
        models.sequelize.sync()
            .then(() => {
                Common.destroyDatabase();
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
                        email: 'email@email.com',
                        type: 'moderator'
                    }).then(function(user) {
                        user.addEntity(entity)
                            .then(() => {
                                Category.create({
                                    id: 1,
                                    name: 'TestCat',
                                    description: 'description'
                                }).then(() => done())
                                    .catch(() => done());
                            });
                    })
                        .catch(() => { done(); });
                })
                    .catch(() => { done(); });
            });
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
                .set('Authorization', '12345') // Token
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
                });
        });
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
                .set('Authorization', '12345') // Token
                .send(event)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
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
                .set('Authorization', '12345') // Token
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
                });
        });
    });
});


describe('List Events', () => {

    before((done) => {
        Common.destroyDatabase();
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
            }).then(function(user) {
                user.addEntity(entity)
                    .then(() => {
                        let start_date = new Date();
                        start_date.setDate(start_date.getDate() + 1);
                        EventModel.create({
                            title: "Test ",
                            description: "Hello There",
                            start_date: start_date,
                            user_id: 1,
                            entity_id: 1

                        }).then((event) => {
                            event.setUser(user).then(() => done());
                        });
                    }).catch(() => done());
            }).catch(() => done());
        }).catch(() => done());
    });


    describe('/GET List Events App', () => {
        it('it should list all events on the App', (done) => {

            chai.request(app)
                .get('/app')
                .set('Authorization', '12345') // Token
                .query({ page: 0, limit: 10 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET List Events Web', () => {
        it('it should list all events on the web', (done) => {

            chai.request(app)
                .get('/web')
                .set('Authorization', '12345') // Token
                .query({ page: 0, limit: 5 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});


describe('Delete Events', () => {

    before((done) => {
        models.sequelize.sync()
            .then(() => {
                Common.destroyDatabase();
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
                        email: 'email@email.com',
                        type: 'moderator'
                    }).then(function(user) {
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
                                }).then(function() { done(); });
                            }).catch(() => { done(); });
                    }).catch(() => { done(); });
                }).catch(() => { done(); });
            }).catch(() => { done(); });
    });

    describe('/DELETE Delete Event', () => {
        it('it should delete a events on the web', (done) => {

            chai.request(app)
                .delete('/')
                .set('Authorization', '12345') // Token
                .send({ id: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });
});


describe('Filter events', () => {

    before((done) => {
        Common.destroyDatabase();
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
            ]).then(() => { return Entity.findAll(); })
                .then((entities) =>
                    // Create user
                    User.create({
                        id: 1,
                        username: 'TestUser',
                        name: 'Test User',
                        password: 'nasdasdasd',
                        email: 'email@email.com',
                        type: 'moderator',
                        token: 'token'
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
                                .then(() => done());
                        })
                )
        );
    });

    describe('/GET Filter events by categories', () => {
        it('It should filter events by categories', (done) => {
            chai.request(app)
                .get('/events')
                .set('Authorization', '12345') // Token
                .query({ categories: 1, user_id: 1, token: 'token' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
    });

    describe('/GET Filter events by entities', () => {
        it('It should filter events by entities', (done) => {
            chai.request(app)
                .get('/events')
                .set('Authorization', '12345') // Token
                .query({ entities: [2, 3], user_id: 1, token: 'token' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(5);
                    done();
                });
        });
    });

    describe('/GET Filter events by categories and entities', () => {
        it('It should filter events by categories and entities', (done) => {
            chai.request(app)
                .get('/events')
                .query({ categories: 1, entities: 2, user_id: 1, token: 'token' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET Filter events with pagination', () => {
        it('It should filter events by categories and entities', (done) => {
            chai.request(app)
                .get('/events')
                .query({ offset: 0, limit: 2, user_id: 1, token: 'token' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
    });
});


describe('Search', () => {

    before((done) => {
        // This.enableTimeouts(false);
        Common.destroyDatabase();
        // Create entities
        Entity.bulkCreate([
            {
                id: 1,
                name: 'Test Entity 1',
                initials: 'TEST1'
            },
            {
                id: 2,
                name: 'Another Entity 2',
                initials: 'ANOT2'
            },
            {
                id: 3,
                name: 'One More Test Entity 3',
                initials: 'ONET3'
            }
        ]).then(() =>

            Category.bulkCreate([
                {
                    id: 1,
                    name: 'Test Category 1'
                },
                {
                    id: 2,
                    name: 'Conference Category 2'
                },
                {
                    id: 3,
                    name: 'One More Test Category 3'
                }
            ]).then(() => { return Entity.findAll(); })
                .then((entities) =>
                    // Create user
                    User.create({
                        id: 1,
                        username: 'TestUser',
                        name: 'Test User',
                        password: 'nasdasdasd',
                        email: 'email@email.com',
                        type: 'moderator',
                        token: '123'
                    }).then((user) => user.setEntities(entities) // Give full permissions to user
                        .then(() => { return Category.findAll(); })
                        .then((categories) => {
                            let start_date1 = new Date();
                            let start_date2 = new Date();
                            let start_date3 = new Date();
                            let start_date4 = new Date();
                            let start_date5 = new Date();
                            let start_date6 = new Date();

                            start_date1.setDate(start_date1.getDate() + 1);
                            start_date2.setDate(start_date2.getDate() + 2);
                            start_date3.setDate(start_date3.getDate() + 3);
                            start_date4.setDate(start_date4.getDate() + 4);
                            start_date5.setDate(start_date5.getDate() + 5);
                            start_date6.setDate(start_date6.getDate() + 6);
                            // Create events

                            EventModel.bulkCreate([
                                {
                                    id: 1,
                                    title: "Event 1",
                                    start_date: start_date1,
                                    user_id: 1,
                                    entity_id: 1,
                                    location: 'Class',
                                    description: 'Conference'
                                },
                                {
                                    id: 2,
                                    title: "Test Conference 2",
                                    start_date: start_date2,
                                    user_id: 1,
                                    entity_id: 2,
                                    location: 'Other',
                                    description: 'Conference 2'
                                },
                                {
                                    id: 3,
                                    title: "Another Conference 3",
                                    start_date: start_date3,
                                    user_id: 1,
                                    entity_id: 2,
                                    location: 'Somewhere'
                                },
                                {
                                    id: 4,
                                    title: "Test Class 4",
                                    start_date: start_date4,
                                    user_id: 1,
                                    entity_id: 3,
                                    location: 'Conference'
                                },
                                {
                                    id: 5,
                                    title: "One More Class 5",
                                    start_date: start_date5,
                                    user_id: 1,
                                    entity_id: 3,
                                    location: 'Class'
                                },
                                {
                                    id: 6,
                                    title: "Global Event 6",
                                    start_date: start_date6,
                                    user_id: 1,
                                    entity_id: 3,
                                    location: 'Anywhere'
                                }
                            ]).then((events) => events[4].setCategories(categories))
                                .then(() => done());
                        }))
                )
        );
    });

    describe('/GET Search for entities', () => {
        it('It should show entities by search pattern', (done) => {
            chai.request(app)
                .get('/search/entities/')
                .set('Authorization', '12345') // Token
                .query({ text: "tes" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    res.body[0].initials.should.be.eql('TEST1');
                    res.body[1].initials.should.be.eql('ONET3');
                    done();
                });
        });
    });

    describe('/GET Search for categories', () => {
        it('It should show categories by search pattern', (done) => {
            chai.request(app)
                .get('/search/categories/')
                .set('Authorization', '12345') // Token
                .query({ text: "tes" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    res.body[0].name.should.be.eql('Test Category 1');
                    res.body[1].name.should.be.eql('One More Test Category 3');
                    done();
                });
        });
    });

    describe('/GET Search for events', () => {
        it('It should show events by search pattern', (done) => {
            chai.request(app)
                .get('/search/events/')
                .set('Authorization', '12345') // Token
                .query({ text: "conf", user_id: 1, token: '123' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(4);
                    res.body[0].title.should.be.eql('Test Conference 2');
                    res.body[0].search_by.should.be.eql('title');
                    res.body[1].title.should.be.eql('Test Class 4');
                    res.body[1].search_by.should.be.eql('location');
                    res.body[2].title.should.be.eql('Event 1');
                    res.body[2].search_by.should.be.eql('description');
                    res.body[3].title.should.be.eql('Another Conference 3');
                    res.body[3].search_by.should.be.eql('title');
                    // TODO: should add category test.
                    done();
                });
        });
    });
});


describe('Information of an event', () => {

    before((done) => {
        models.sequelize.sync()
            .then(() => {
                Common.destroyDatabase();
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
                        email: 'email@email.com',
                        type: 'moderator'
                    }).then(function(user) {
                        user.addEntity(entity)
                            .then(() => {
                                let start_date = new Date();
                                let end_date = new Date();
                                start_date.setDate(start_date.getDate() + 1);
                                end_date.setDate(end_date.getDate() + 2);
                                EventModel.create({
                                    id: 1,
                                    title: "Information of Event Test",
                                    description: "It is a test event, without content",
                                    start_date: start_date.toISOString(),
                                    end_date: end_date.toISOString(),
                                    location: "Random Location",
                                    price: 10,
                                    user_id: 1,
                                    entity_id: 1
                                }).then(function() { done(); });
                            }).catch(() => { done(); });
                    }).catch(() => { done(); });
                }).catch(() => { done(); });
            }).catch(() => { done(); });
    });


    describe('/GET Information of an Event', () => {
        it('it should show all the information of an event', (done) => {

            chai.request(app)
                .get('/events/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.title.should.be.eql('Information of Event Test');
                    done();
                });
        });
    });
});
