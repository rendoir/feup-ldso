process.env.NODE_ENV = 'test';

let EventModel = require('../models').events;
let Entity = require('../models/').entities;

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//delete all events before the each test
describe('Events', () => {
    beforeEach((done) => {
        EventModel.destroy({
            where: {}
        })
     /*   Entity.create({
            name: 'Test Entity',
            initials: 'TEST',
            description: 'test description'
        })*/
        EventModel.create({ 
            title: "Test ",
            description:"This is one of the many tests",
            start_date: "2018-10-12",
            poster_id: 1,
            entity_id: 1
         })
                 
        EventModel.create({ 
            title: "Test  2",
            description:"LOOK AT ME",
            start_date: "2018-10-15",
            poster_id: 1,
            entity_id: 9
         })

        .catch((err) => done());

    });
    
    describe('/GET List Events App', () => {
        it('it should list all events on the App', (done) => {
            
            chai.request(app)
            .get('/app')
            .query({page: 0, limit: 10})
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
                done();
              })          
            });
        });   

  /*  describe('/GET List Events Web', () => {
        it('it should list all events on the Web', (done) => {

            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                  //  res.body.length.should.be.eql(0);
                done();
              });
        })
    });*/

    
});


    