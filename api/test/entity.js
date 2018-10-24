process.env.NODE_ENV = 'test';

let models = require('../models')
let Entity = require('../models').entities;
let User = require('../models').users;
let Permission = require('../models').permissions;
let Favorite = require('../models/').favorites;

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('List Entities', () => {

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
                                Entity.create({
                                    id: 4,
                                    name: 'Test Entity 4',
                                    initials: 'TEST4',
                                    description: 'test description'
                                }).then(() => done())
                                .catch((err) => done());
                            }).catch((err) => done());
                        }).catch((err) => done());
                    }).catch((err) => done());
            })
    })

    describe('/GET List Entities for which the User has permissions to', () => {
        it('it should list all entities for which the User has permissions to', (done) => {

            chai.request(app)
                .get('/entities')
                .query({ user_id: 1 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    done();
                })
        });
    });

    describe('/GET List Entities for which the User has no permissions to', () => {
        it('it should list no entities', (done) => {

            chai.request(app)
                .get('/entities')
                .query({ user_id: 2 })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                })
        });
    });

    describe('/GET List Entities', () => {
        it('it should list all entities', (done) => {

            chai.request(app)
                .get('/app/entities')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(4);
                    done();
                })
        });
    });
})