const chai = require('chai');
const chaiHttp = require('chai-http');
// const app = require('../app');
const base_url= "http://localhost:3000";
const should = chai.should();
process.env.NODE_ENV = 'test';
const User = require('./../models/user');

chai.use(chaiHttp)

describe('/POST user', () => {
    it('it sould post the user info', (done) => {
        const user = {
            user:{
                firstName: " Husne Ara1",
                lastName: "Asma1",
                email: "asma1@gmail.com",
                password:"password1"
            }

        };
        chai.request(base_url)
        .post('/users')
        .send(user)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('email');
            res.body.should.have.property('first_name');
            res.body.should.have.property('last_name');
            res.body.should.have.property('updatedAt');
            res.body.should.have.property('createdAt');
            done();
        });
    });
});

