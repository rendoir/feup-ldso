process.env.NODE_ENV = 'test';

let models = require('../models');
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

describe('Favorite/Unfavorite an event', () => {

  
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
                            id: 1,
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

    describe('/GET Checks if an event is favorited', () => {
        it('it should check that the user does not have an event as favorite', (done) => {

            chai.request(app)
                .get('/favorite?event_id=1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('has_favorite');
                    chai.expect(res.body.has_favorite).to.equal(false);
                    done();
                })
        });
    });

    describe('/POST Favorites an event', () => {
        it('it should favorite an event', (done) => {

            chai.request(app)
                .post('/favorite')
                .send( { event_id: 1 } )
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    chai.expect(res.body.message).to.equal("The event was added to your favorites!");
                    done();
                })
        });
    });

    describe('/GET Checks if an event is favorited, after adding as favorite', () => {
        it('it should check that the user has an event as favorite', (done) => {

            chai.request(app)
                .get('/favorite?event_id=1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('has_favorite');
                    chai.expect(res.body.has_favorite).to.equal(true);
                    done();
                })
        });
    });

    describe('/POST Unfavorites an event', () => {
        it('it should unfavorite an event', (done) => {

            chai.request(app)
                .post('/favorite')
                .send( { event_id: 1 } )
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    chai.expect(res.body.message).to.equal("The event was removed from your favorites!");
                    done();
                })
        });
    });

    describe('/GET Checks if an event is favorited, after removing as favorite', () => {
        it('it should check that the user does not have an event as favorite', (done) => {

            chai.request(app)
                .get('/favorite?event_id=1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('has_favorite');
                    chai.expect(res.body.has_favorite).to.equal(false);
                    done();
                })
        });
    });
})