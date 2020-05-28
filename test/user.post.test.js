process.env.NODE_ENV = "test";



const chai = require('chai');
const chaiHttp = require('chai-http');

const sinon = require("sinon");
const should = chai.should();
chai.use(chaiHttp);
var mysql = require('mysql');


const server = require('./../server');

describe('/POST user', () => {
    it('it should post the user info', (done) => {
        const user = {
            user:{
                firstName: " Husne Ara",
                lastName: "Asma",
                email: "asma6@gmail.com",
                password:"Husne Ara"
            }
        };
        

        chai.request(server)
        .post('/users')
        .send(user)
        .end((err, res) => {
            // console.log(res)
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
