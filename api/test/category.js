process.env.NODE_ENV = 'test';

let models = require('../models');
let Category = require('../models').categories;

let Common = require('./common');

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
chai.should();

chai.use(chaiHttp);
/*

describe('Categories', () => {

    before((done) => {
        models.sequelize.sync()
            .then(() => {
                Common.destroyDatabase();
                Category.bulkCreate([
                    {
                        id: 1,
                        name: "Category 1",
                        description: "description 1"
                    },
                    {
                        id: 2,
                        name: "Category 2",
                        description: "description 2"
                    },
                    {
                        id: 3,
                        name: "Category 3",
                        description: "description 3"
                    }, {
                        id: 4,
                        name: "Category 4",
                        description: "description 4"
                    }
                ]).then(() => done())
                    .catch(() => done());
            }).catch(() => done());
    });

    describe('/GET Categories', () => {

        it('should return all categories', (done) => {

            chai.request(app)
                .get('/categories')
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(4);
                    done();
                });
        });


    });

});

*/