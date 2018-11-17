process.env.NODE_ENV = 'test';

let models = require('../models');
let EventModel = require('../models').events;
let Entity = require('../models').entities;
let User = require('../models').users;
let Favorite = require('../models').favorites;
let Common = require('./common');

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {

    describe('/POST App Login New User', () => {

        before((done) => {
            models.sequelize.sync()
                .then(() => {
                    User.destroy({
                        where: {},
                        truncate: true,
                        cascade: true
                    })
                        .then(() => done())
                        .catch(() => done());
                })
                .catch(() => done());
        });

        it('should login a new mobile user', (done) => {

            let userBody = {
                email: "test2user@test.com",
                accessToken: "sdfipasdfasiudfbiuasdbf",
                name: "test2user",
                username: "test2user"
            };
            chai.request(app)
                .post('/app/login')
                .send(userBody)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('accessToken');
                    res.body.should.have.property('userId');
                    done();
                });
        });

        describe("/POST App Login Existing User", () => {

            before((done) => {
                models.sequelize.sync()
                    .then(() => {
                        User.destroy({
                            where: {},
                            truncate: true,
                            cascade: true
                        });
                        User.create({
                            id: 1,
                            username: "test",
                            password: "$2a$10$MKm2RWpxsZQmrQMNl4TkMuwCVjNymctysHlXl8pLw/mQlA1eG2dCW",
                            name: "Test User",
                            email: "test@test.com",
                            type: "moderator"
                        })
                            .then(() => done())
                            .catch(() => done());
                    }).catch(() => done());
            });

            it('should login an existing mobile user', (done) => {
                let userBody = {
                    email: "test@test.com",
                    accessToken: "abc"
                };
                chai.request(app)
                    .post('/app/login')
                    .send(userBody)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('accessToken');
                        res.body.should.have.property('userId');
                        done();
                    });
            });

        });
    });

    describe('/POST Login', () => {

        before((done) => {
            models.sequelize.sync()
                .then(() => {
                    User.destroy({
                        where: {},
                        truncate: true,
                        cascade: true
                    });
                    User.create({
                        id: 1,
                        username: "test",
                        password: "$2a$10$MKm2RWpxsZQmrQMNl4TkMuwCVjNymctysHlXl8pLw/mQlA1eG2dCW",
                        name: "Test User",
                        email: "test@test.com",
                        type: "moderator"
                    })
                        .then(() => done())
                        .catch(() => done());
                }).catch(() => done());
        });

        it('should login into a new user', (done) => {

            let user = {
                email: "test@test.com",
                password: "password"
            };
            chai.request(app)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.should.have.property('info');
                    done();
                });
        });

        it('should return error message when logging in with wrong password', (done) => {

            let user = {
                email: "test@test.com",
                password: "password21"
            };

            chai.request(app)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.be.a('object');
                    res.error.text.should.equal('Email or Password is invalid');
                    done();
                });
        });

        it('should return error message when logging in with wrong email', (done) => {

            let user = {
                email: "test21@test.com",
                password: "password21"
            };

            chai.request(app)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.should.be.a('object');
                    res.error.text.should.equal('Email or Password is invalid');
                    done();
                });
        });

    });

    describe('/POST Logout', () => {

        it('should logout successfully', (done) => {

            chai.request(app)
                .post('/logout')
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Logged out successfully');
                    done();
                });
        });

    });
});

describe('Favorite/Unfavorite an event', () => {


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
                password: 'password',
                email: 'email@email.com',
                type: 'moderator',
                token: 'token'
            }).then(function(user) {
                user.addEntity(entity)
                    .then(() => {
                        let start_date = new Date();
                        start_date.setDate(start_date.getDate() + 1);
                        EventModel.create({
                            id: 1,
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

    describe('/GET Checks if an event is favorited', () => {
        it('it should check that the user does not have an event as favorite', (done) => {
            chai.request(app)
                .get('/events?token=token&user_id=1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);
                    chai.expect(res.body[0]).to.be.a('object');
                    chai.expect(res.body[0]).to.have.property('favorite');
                    chai.expect(res.body[0].favorite).to.be.a('array');
                    chai.expect(res.body[0].favorite).to.have.length(0);
                    done();
                });
        });
    });

    describe('/POST Favorites an event', () => {
        it('it should favorite an event', (done) => {

            chai.request(app)
                .post('/favorite')
                .send({
                    event_id: 1,
                    user_id: 1,
                    token: 'token'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    chai.expect(res.body.message).to.equal("The event was added to your favorites!");
                    done();
                });
        });
    });

    describe('/GET Checks if an event is favorited, after adding as favorite', () => {
        it('it should check that the user has an event as favorite', (done) => {
            chai.request(app)
                .get('/events?token=token&user_id=1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);
                    chai.expect(res.body[0]).to.be.a('object');
                    chai.expect(res.body[0]).to.have.property('favorite');
                    chai.expect(res.body[0].favorite).to.be.a('array');
                    chai.expect(res.body[0].favorite).to.have.length(1);
                    done();
                });
        });
    });

    describe('/POST Unfavorites an event', () => {
        it('it should unfavorite an event', (done) => {

            chai.request(app)
                .post('/favorite')
                .send({
                    event_id: 1,
                    user_id: 1,
                    token: 'token'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    chai.expect(res.body.message).to.equal("The event was removed from your favorites!");
                    done();
                });
        });
    });

    describe('/GET Checks if an event is favorited, after removing as favorite', () => {
        it('it should check that the user does not have an event as favorite', (done) => {
            chai.request(app)
                .get('/events?token=token&user_id=1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);
                    chai.expect(res.body[0]).to.be.a('object');
                    chai.expect(res.body[0]).to.have.property('favorite');
                    chai.expect(res.body[0].favorite).to.be.a('array');
                    chai.expect(res.body[0].favorite).to.have.length(0);
                    done();
                });
        });
    });
});


describe('List favorites', () => {

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
                password: 'password',
                email: 'email@email.com',
                type: 'moderator',
                token: 'token'
            }).then(function(user) {
                user.addEntity(entity)
                    .then(() => {
                        let start_date = new Date();
                        start_date.setDate(start_date.getDate() + 1);
                        EventModel.create({
                            id: 1,
                            title: "Test ",
                            description: "Hello There",
                            start_date: start_date,
                            user_id: 1,
                            entity_id: 1
                        }).then((event) => {
                            event.setUser(user).then(() => {
                                Favorite.create({
                                    event_id: 1,
                                    user_id: 1
                                }).then((favorite) =>
                                    user.setFavorite(favorite))
                                    .then(() => done());
                            });
                        }).catch(() => done());
                    }).catch(() => done());
            }).catch(() => done());
        });
    });


    describe('/GET Checks if an event is favorited', () => {
        it('it should check that the user does not have an event as favorite', (done) => {
            chai.request(app)
                .get('/events?token=token&user_id=1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.should.have.length(1);
                    chai.expect(res.body[0]).to.be.a('object');
                    chai.expect(res.body[0]).to.have.property('favorite');
                    chai.expect(res.body[0].favorite).to.be.a('array');
                    chai.expect(res.body[0].favorite).to.have.length(0);
                    done();
                });
        });
    });
});
