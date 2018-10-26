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
                                done();
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
                user_id: 1,
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
                .field("user_id", event.user_id)
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
                            user_id: 1,
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
                    .then(() =>{                        
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
                        }).then(function() { done();})
                    }).catch((err) => {done()});
                }).catch((err) => {done()});
            }).catch((err) => {done()});
        }).catch((err) => {done()});
    });

    describe('/DELETE Delete Event', () => {
        it('it should delete a events on the web', (done) => {
                   
            chai.request(app)
            .delete('/')
            .send({id: 1})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                done();
            })
        })        
    });
});


describe('List Events by Entities', () => {

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
        Entity.bulkCreate([
            {
                id: 1,
                name: 'Test Entity',
                initials: 'TEST',
                description: 'test description'
            },
            {
                id: 2,
                name: 'Test Entity 2',
                initials: 'TEST2',
                description: 'test description'
            },
            {
                id: 3,
                name: 'Test Entity 3',
                initials: 'TEST3',
                description: 'test description'
            }
        ]).then(() => { return Entity.findAll() })
            .then((entities) => {
                User.create({
                    id: 1,
                    username: 'TestUser',
                    name: 'Test User',
                    password: 'nasdasdasd',
                    email: 'email@email.com'
                }).then(function (user) {
                    user.setEntities(entities).then(() => {
                        let start_date = new Date();
                        start_date.setDate(start_date.getDate() + 1);
                        EventModel.bulkCreate([
                            {
                                title: "Test ",
                                description: "Hello There",
                                start_date: start_date,
                                user_id: 1,
                                entity_id: 1
                            },
                            {
                                title: "Test 2",
                                description: "Hello There",
                                start_date: start_date,
                                user_id: 1,
                                entity_id: 2
                            },
                            {
                                title: "Test 3",
                                description: "Hello There",
                                start_date: start_date,
                                user_id: 1,
                                entity_id: 2
                            },
                            {
                                title: "Test 4",
                                description: "Hello There",
                                start_date: start_date,
                                user_id: 1,
                                entity_id: 3
                            },
                            {
                                title: "Test 5",
                                description: "Hello There",
                                start_date: start_date,
                                user_id: 1,
                                entity_id: 3
                            },
                            {
                                title: "Test 6",
                                description: "Hello There",
                                start_date: start_date,
                                user_id: 1,
                                entity_id: 3
                            },
                        ]).then(() => {
                            done();
                        })
                    }).catch((err) => done());
                }).catch((err) => done());
            }).catch((err) => done());

    });


    describe('/GET List Events by Entity', () => {
        it('it should list all events that were created by the wanted entity', (done) => {

            chai.request(app)
                .get('/search')
                .query({ entities: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                })
        });
    });

    describe('/GET List Events by Entities', () => {
        it('it should list all events created by the wanted entities', (done) => {

            chai.request(app)
                .get('/search')
                .query({ entities: [2, 3] })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(5);
                    done();
                })
        });
    });


});


describe('List Events by Categories', () => {

    before((done) => {
        User.destroy({
            where: {},
            truncate: true,
            cascade: true
        });
        Entity.destroy({
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
        });
        Permission.destroy({
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
                email: 'email@email.com'
            }).then((user) => {
                user.addEntity(entity).then(() => {
                    let start_date = new Date();
                    start_date.setDate(start_date.getDate() + 1);
                    Category.create({
                        id: 1,
                        name: 'Test Category',
                        description: 'test description'
                    }).then((category) => {
                        EventModel.create({
                            id: 1,
                            title: "Test ",
                            description: "Hello There",
                            start_date: start_date,
                            user_id: 1,
                            entity_id: 1
                        }).then((event) => {
                            event.addCategory(category);
                            Category.bulkCreate([
                                {
                                    id: 2,
                                    name: 'Test Category 2',
                                    description: 'test description'
                                },
                                {
                                    id: 3,
                                    name: 'Test Category 3',
                                    description: 'test description'
                                }
                            ]).then(() => { return Category.findAll({
                                where: {
                                    id: {
                                        [models.sequelize.Op.or]: [2,3]
                                    }
                                }
                            })}).then((categories) => {
                                EventModel.create({
                                    id: 2,
                                    title: "Test 2",
                                    description: "Hello There",
                                    start_date: start_date,
                                    user_id: 1,
                                    entity_id: 1
                                }).then((event) => {
                                    event.setCategories(categories).then(()=>done());
                                })
                            })
                        }).catch((err) => done());
                    })
                })
            }).catch((err) => done());
        }).catch((err) => done());

    });


    describe('/GET List Events by Category', () => {
        it('it should list all events that are related to the wanted category', (done) => {

            chai.request(app)
                .get('/events/categories')
                .query({ categories: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                })
        });
    });

    describe('/GET List Events by Categories', () => {
        it('it should list all events that are related to the wanted categories', (done) => {

            chai.request(app)
                .get('/events/categories')
                .query({ categories: [2, 3] })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                })
        });
    });


});


