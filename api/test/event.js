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

chai.use(require('chai-like'));
chai.use(require('chai-things'));

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
                                    name_english: 'TestCat',
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
                title_english: "Test Event",
                description: "It is a test event, without content",
                description_english: "It is a test event, without content",
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
                title_english: "Test Event",
                description: "It is a test event, without content",
                description_english: "It is a test event, without content",
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
                title_english: "Test Event22",
                description: "It is a test event, without content",
                description_english: "It is a test event, without content",
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
                .field("title_english", event.title_english)
                .field("description", event.description)
                .field("description_english", event.description_english)
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
                            title_english: "Test ",
                            description: "Hello There",
                            description_english: "Hello There",
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
                                    title_english: "Delete Event Test",
                                    description: "It is a test event, without content",
                                    description_english: "It is a test event, without content",
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
                    name: 'Test Category 1',
                    name_english: 'Test Category 1'
                },
                {
                    id: 2,
                    name: 'Test Category 2',
                    name_english: 'Test Category 2'
                },
                {
                    id: 3,
                    name: 'Test Category 3',
                    name_english: 'Test Category 3'
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
                                    title_english: "Test 1",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 1
                                },
                                {
                                    id: 2,
                                    title: "Test 2",
                                    title_english: "Test 2",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 2
                                },
                                {
                                    id: 3,
                                    title: "Test 3",
                                    title_english: "Test 3",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 2
                                },
                                {
                                    id: 4,
                                    title: "Test 4",
                                    title_english: "Test 4",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 3
                                },
                                {
                                    id: 5,
                                    title: "Test 5",
                                    title_english: "Test 5",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 3
                                },
                                {
                                    id: 6,
                                    title: "Test 6",
                                    title_english: "Test 6",
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

    describe('/GET Filter events with wrong token', () => {
        it('It should not return events', (done) => {
            chai.request(app)
                .get('/events')
                .query({ user_id: 1, token: 'wrong_token' })
                .end((err, res) => {
                    res.should.have.status(401);
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
                    name: 'Test Category 1',
                    name_english: 'Test Category 1'
                },
                {
                    id: 2,
                    name: 'Conference Category 2',
                    name_english: 'Conference Category 2'
                },
                {
                    id: 3,
                    name: 'One More Test Category 3',
                    name_english: 'One More Test Category 3'
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
                                    title: "Evento 1",
                                    title_english: "Event 1",
                                    start_date: start_date1,
                                    user_id: 1,
                                    entity_id: 1,
                                    location: 'Class',
                                    description: 'Conference',
                                    description_english: 'Conference'
                                },
                                {
                                    id: 2,
                                    title: "Test Conference 2",
                                    title_english: "Test Conference 2",
                                    start_date: start_date2,
                                    user_id: 1,
                                    entity_id: 2,
                                    location: 'Other',
                                    description: 'Conference 2',
                                    description_english: 'Conference 2'
                                },
                                {
                                    id: 3,
                                    title: "Another Conference 3",
                                    title_english: "Another Conference 3",
                                    start_date: start_date3,
                                    user_id: 1,
                                    entity_id: 2,
                                    location: 'Somewhere'
                                },
                                {
                                    id: 4,
                                    title: "Test Class 4",
                                    title_english: "Test Class 4",
                                    start_date: start_date4,
                                    user_id: 1,
                                    entity_id: 3,
                                    location: 'Conference'
                                },
                                {
                                    id: 5,
                                    title: "One More Class 5",
                                    title_english: "One More Class 5",
                                    start_date: start_date5,
                                    user_id: 1,
                                    entity_id: 3,
                                    location: 'Class'
                                },
                                {
                                    id: 6,
                                    title: "Evento Global 6",
                                    title_english: "Global Event 6",
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
                .query({ text: "conf", user_id: 1, token: '123', lang: 'PT' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(4);
                    chai.expect(res.body).to.contain.something.like({ title: 'Test Conference 2', search_by: 'title' });
                    chai.expect(res.body).to.contain.something.like({ title: 'Test Class 4', search_by: 'location' });
                    chai.expect(res.body).to.contain.something.like({ title: 'Evento 1', search_by: 'description' });
                    chai.expect(res.body).to.contain.something.like({ title: 'Another Conference 3', search_by: 'title' });
                    done();
                });
        });
    });

    describe('/GET Search for events', () => {
        it('It should show events by search pattern in English', (done) => {
            chai.request(app)
                .get('/search/events/')
                .query({ text: "Event", user_id: 1, token: '123', lang: 'EN' })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    chai.expect(res.body).to.contain.something.like({ title_english: 'Global Event 6', search_by: 'title' });
                    chai.expect(res.body).to.contain.something.like({ title_english: 'Event 1', search_by: 'title' });
                    done();
                });
        });
    });

    describe('/GET Search for events', () => {
        it('It should not show events with a wrong token', (done) => {
            chai.request(app)
                .get('/search/events/')
                .query({ text: "conf", user_id: 1, token: '321', lang: 'PT' })
                .end((err, res) => {
                    res.should.have.status(401);
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
                                    title_english: "Information of Event Test",
                                    description: "It is a test event, without content",
                                    description_english: "It is a test event, without content",
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


describe('List and filter favorited events', () => {

    before((done) => {
        models.sequelize.sync().then(() => {
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
                },
                {
                    id: 4,
                    name: 'One More Test Entity 4',
                    initials: 'ONET4'
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
                                        title_english: "Event 1",
                                        start_date: start_date1,
                                        user_id: 1,
                                        entity_id: 1,
                                        location: 'Class',
                                        description: 'Conference'
                                    },
                                    {
                                        id: 2,
                                        title: "Test Conference 2",
                                        title_english: "Test Conference 2",
                                        start_date: start_date2,
                                        user_id: 1,
                                        entity_id: 2,
                                        location: 'Other',
                                        description: 'Conference 2'
                                    },
                                    {
                                        id: 3,
                                        title: "Another Conference 3",
                                        title_english: "Another Conference 3",
                                        start_date: start_date3,
                                        user_id: 1,
                                        entity_id: 2,
                                        location: 'Somewhere'
                                    },
                                    {
                                        id: 4,
                                        title: "Test Class 4",
                                        title_english: "Test Class 4",
                                        start_date: start_date4,
                                        user_id: 1,
                                        entity_id: 3,
                                        location: 'Conference'
                                    },
                                    {
                                        id: 5,
                                        title: "One More Class 5",
                                        title_english: "One More Class 5",
                                        start_date: start_date5,
                                        user_id: 1,
                                        entity_id: 4,
                                        location: 'Class'
                                    },
                                    {
                                        id: 6,
                                        title: "Global Event 6",
                                        title_english: "Global Event 6",
                                        start_date: start_date6,
                                        user_id: 1,
                                        entity_id: 4,
                                        location: 'Anywhere'
                                    }
                                ]).then((events) => {
                                    events[0].addCategory(categories[0]).then(function() {
                                        events[1].addCategory(categories[0]).then(function() {
                                            user.addFavorite(events[0]).then(function() {
                                                user.addFavorite(events[1]).then(function() {
                                                    user.addFavorite(events[2]).then(function() {
                                                        user.addFavorite(events[3]).then(function() {
                                                            done();
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }))));
        });
    });

    describe('/GET List all favorites', () => {
        it('It should list all favorited events ', (done) => {
            chai.request(app)
                .get('/events/favorites?user_id=1&token=123')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(4);
                    done();
                });
        });
    });

    describe('/GET Filter events by categories', () => {
        it('It should filter favorited events by categories', (done) => {
            chai.request(app)
                .get('/events/favorites?user_id=1&token=123')
                .query({ categories: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
    });

    describe('/GET Filter events by entities', () => {
        it('It should filter favorited events by entities', (done) => {
            chai.request(app)
                .get('/events/favorites?user_id=1&token=123')
                .query({ entities: [1, 2, 3] })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(4);
                    done();
                });
        });
    });

    describe('/GET Filter events by categories and entities', () => {
        it('It should filter favorited events by categories and entities', (done) => {
            chai.request(app)
                .get('/events/favorites?user_id=1&token=123')
                .query({ categories: 1, entities: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET Filter events with pagination', () => {
        it('It should filter favorited events using pagination', (done) => {
            chai.request(app)
                .get('/events/favorites?user_id=1&token=123')
                .query({ offset: 0, limit: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
    });

    describe('/GET List all favorites unauthorized', () => {
        it('It should not list events if user token is wrong', (done) => {
            chai.request(app)
                .get('/events/favorites?user_id=1&token=321')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});

describe('Search events by Text', () => {

    before((done) => {
        Common.destroyDatabase();
        // Create entities
        Entity.bulkCreate([
            {
                id: 1,
                name: 'Test Entity 1',
                initials: 'TEST1'
            }
        ]).then(() =>
            // Create categories
            Category.bulkCreate([
                {
                    id: 1,
                    name: 'Test Category 1',
                    name_english: 'Test Category 1'
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
                            let start_date2 = new Date();
                            start_date2.setDate(start_date2.getDate() + 2);
                            let start_date3 = new Date();
                            start_date3.setDate(start_date3.getDate() + 3);
                            // Create events
                            EventModel.bulkCreate([
                                {
                                    id: 1,
                                    title: "Test 1",
                                    title_english: "Test 1",
                                    description: "It is a test event, without content",
                                    description_english: "It is a test event, without content",
                                    start_date: start_date,
                                    end_date: null,
                                    price: 10,
                                    user_id: 1,
                                    entity_id: 1
                                },
                                {
                                    id: 2,
                                    title: "Test 2",
                                    title_english: "Test 2",
                                    description: "It is a test event, without content",
                                    description_english: "It is a test event, without content",
                                    start_date: start_date2,
                                    end_date: null,
                                    price: 10,
                                    user_id: 1,
                                    entity_id: 1
                                },
                                {
                                    id: 3,
                                    title: "Event 3",
                                    title_english: "Event 3",
                                    description: "It is a event, without content",
                                    description_english: "It is a event, without content",
                                    start_date: start_date,
                                    end_date: null,
                                    price: 10,
                                    user_id: 1,
                                    entity_id: 1
                                },
                                {
                                    id: 4,
                                    title: "Test 4",
                                    title_english: "Test 4",
                                    description: "It is a test event, without content",
                                    description_english: "It is a test event, without content",
                                    start_date: start_date3,
                                    end_date: null,
                                    price: 10,
                                    user_id: 1,
                                    entity_id: 1
                                },
                                {
                                    id: 5,
                                    title: "Event 5",
                                    title_english: "Event 5",
                                    description: "It is a event, without content",
                                    description_english: "It is a event, without content",
                                    start_date: start_date2,
                                    end_date: null,
                                    price: 10,
                                    user_id: 1,
                                    entity_id: 1
                                }
                            ])
                                .then(() => done())
                                .catch(() => done());
                        })
                )
        );
    });

    describe('/GET Search Event by Text', () => {

        it('it should get event with pagination - Event', (done) => {

            chai.request(app)
                .get('/search/events/web')
                .set('Authorization', '12345') // Token
                .query({ text: "Event", page: 0, limit: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("count");
                    res.body.should.have.property("rows");
                    res.body.rows.length.should.be.eql(2);
                    res.body.count.should.be.eql(5);
                    res.body.rows[0].title.should.be.eql("Event 3");
                    res.body.rows[1].title.should.be.eql("Event 5");
                    done();
                });
        });

        it('it should get event with pagination - Test', (done) => {

            chai.request(app)
                .get('/search/events/web')
                .set('Authorization', '12345') // Token
                .query({ text: "Test", page: 2, limit: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("count");
                    res.body.should.have.property("rows");
                    res.body.rows.length.should.be.eql(1);
                    res.body.count.should.be.eql(3);
                    res.body.rows[0].title.should.be.eql("Test 4");
                    done();
                });
        });

        it('it should get event with pagination - No results', (done) => {

            chai.request(app)
                .get('/search/events/web')
                .set('Authorization', '12345') // Token
                .query({ text: "asdbfasdbf", page: 0, limit: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("count");
                    res.body.should.have.property("rows");
                    res.body.rows.length.should.be.eql(0);
                    done();
                });
        });

        it('it should get event with pagination - Big page ', (done) => {

            chai.request(app)
                .get('/search/events/web')
                .set('Authorization', '12345') // Token
                .query({ text: "Test", page: 10, limit: 10 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("count");
                    res.body.should.have.property("rows");
                    res.body.rows.length.should.be.eql(0);
                    done();
                });
        });
    });

});

describe('Edit events', () => {

    before((done) => {
        Common.destroyDatabase();
        // Create entities
        Entity.bulkCreate([
            {
                id: 1,
                name: 'Test Entity 1',
                initials: 'TEST1'
            }
        ]).then(() =>
            // Create categories
            Category.bulkCreate([
                {
                    id: 1,
                    name: 'Test Category 1',
                    name_english: 'Test Category 1'
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
                                    title_english: "Test 1",
                                    description: "It is a test event, without content",
                                    description_english: "It is a test event, without content",
                                    start_date: start_date,
                                    end_date: null,
                                    price: 10,
                                    user_id: 1,
                                    entity_id: 1
                                },
                                {
                                    id: 2,
                                    title: "Test 2",
                                    title_english: "Test 2",
                                    description: "It is a test event, without content",
                                    description_english: "It is a test event, without content",
                                    start_date: start_date,
                                    end_date: null,
                                    price: 10,
                                    user_id: 1,
                                    entity_id: 1
                                }
                            ])
                                // Add category 1 to event 1
                                .then(() => Category.findByPrimary(1)
                                    .then((category) => EventModel.findByPrimary(1)
                                        .then((event) => event.addCategory(category)
                                        )))
                                // Add category 1 to event 2
                                .then(() => Category.findByPrimary(1)
                                    .then((category) => EventModel.findByPrimary(2)
                                        .then((event) => event.addCategory(category)
                                        )))
                                .then(() => done());
                        })
                )
        );
    });

    describe('/POST Edit Event', () => {
        it('it should edit an event', (done) => {

            let start_date = new Date();
            start_date.setDate(start_date.getDate() + 1);
            let newEvent = {
                title: "New Test Event",
                title_english: "Test Event",
                description: "It is a test event, without content",
                description_english: "It is a test event, without content",
                start_date: start_date.toISOString(),
                end_date: null,
                location: "Random Location",
                price: 10,
                user_id: 1,
                entity_id: 1,
                categories: '1'
            };

            EventModel.findByPrimary(1)
                .then((oldEvent) => {
                    chai.request(app)
                        .put('/events/1')
                        .set('Authorization', '12345') // Token
                        .send(newEvent)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.title.should.be.eql("New Test Event");
                            res.body.title.should.not.be.eql(oldEvent.dataValues.title);
                            res.body.title_english.should.be.eql("Test Event");
                            res.body.title_english.should.not.be.eql(oldEvent.dataValues.title_english);
                            res.body.should.have.property('title');
                            done();
                        });
                });
        });
    });

    describe('/POST Edit Event With a new File', () => {

        it('it should save the new file in directory', (done) => {

            EventModel.findByPrimary(2)
                .then((oldEvent) => {
                    let start_date = new Date();
                    start_date.setDate(start_date.getDate() + 1);
                    let end_date = new Date();
                    end_date.setDate(start_date.getDate() + 2);
                    let event = {
                        title: "New Test Event 2",
                        title_english: "Test Event",
                        description: "It is a test event, without content",
                        description_english: "It is a test event, without content",
                        start_date: start_date.toISOString(),
                        end_date: end_date.toISOString(),
                        location: "Random Location",
                        price: 10,
                        user_id: 1,
                        entity_id: 1,
                        categories: '1'
                    };
                    chai.request(app)
                        .put('/events/1')
                        .set('Authorization', '12345') // Token
                        .field("title", event.title)
                        .field("title_english", event.title_english)
                        .field("description", event.description)
                        .field("description_english", event.description_english)
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
                            res.body.title.should.be.eql("New Test Event 2");
                            res.body.title.should.not.be.eql(oldEvent.dataValues.title);
                            res.body.should.have.property('title');
                            done();
                        });
                });
        });
    });

    describe('/POST Edit Event Failure', () => {
        it('it should fail to edit an event because there is no event with said id', (done) => {

            let start_date = new Date();
            start_date.setDate(start_date.getDate() + 1);
            let newEvent = {
                title: "New Test Event",
                title_english: "Test Event",
                description: "It is a test event, without content",
                description_english: "It is a test event, without content",
                start_date: start_date.toISOString(),
                end_date: null,
                location: "Random Location",
                price: 10,
                user_id: 1,
                entity_id: 1,
                categories: '1'
            };

            chai.request(app)
                .put('/events/10')
                .set('Authorization', '12345') // Token
                .send(newEvent)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.eql("There was a problem editing this event. Please try again later.");
                    done();
                });

        });
    });
});
