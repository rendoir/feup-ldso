process.env.NODE_ENV = 'test';

let EventModel = require('../models').events;
let Entity = require('../models/').entities;
let User = require('../models/').users;
let Permission = require('../models/').permissions;
let Favorite = require('../models/').favorites;

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//delete all events before the each test
describe('Events', () => {
    beforeEach((done) => {
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
        })
                 
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
                user.addEntity(entity);
                EventModel.create({ 
                    title: "Test ",
                    description:"Hello There",
                    start_date: "2018-10-13",
                    poster_id: 1,
                    entity_id: 1
                }).then(function(event){
                    event.addUser(user);                        
                    done();
                })           
            })
            .catch((err) => done());
        })
        .catch((err) => done())
    });

   /* describe('/POST Add Event', () => {
        it('it should add a new event', (done) => {

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
            }

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
                done();
        })
    });*/


    describe('/GET List Events App', () => {
        it('it should list all events on the App', (done) => {

            chai.request(app)
            .get('/app')
            .query({page: 0, limit: 10})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
              })          
            });
        });   

    
});
