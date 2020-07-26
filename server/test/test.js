
const chai = require('chai');
const http = require('chai-http');
const expect = chai.expect;
const version = '/v1';

//start app
const app = require('../app');

//import User model
const User = require('../models/user')

chai.use(http);

describe('App basic tests', () => {

    before((done) => {
        //delete all users 
        User.find().deleteMany().then(res => {
            console.log('Users removed');
            done();
        }).catch(err => {
            console.log(err.message);
        });
    });
    it('Should exists', () => {
        expect(app).to.be.a('function');
        
    })
})

describe('User registration', () => {

    it('Should return 201 and confirmation for valid input', (done) => {
        //mock valid user input
        let user_input = {
            "name": "Diego",
            "email": "diegoarturosilva@hotmail.com",
            "password": "secret"
        }
        //send request to the app
        chai.request(app).post(`${version}/register`)
            .send(user_input)
            .then((res) => {
                //console.log(res.body);
                //assertions
                expect(res).to.have.status(201);
                expect(res.body.message).to.be.equal("User registered");
                expect(res.body.errors.length).to.be.equal(0);

                expect(res.body.user._id).to.exist;
                expect(res.body.user.createdAt).to.exist;
                expect(res.body.user.password).to.not.be.eql(user_input.password);
                done();
            }).catch(err => {
                console.log(err.message);
            })
    });
    it('Should return 401 and confirmation for valid input', (done) => {
        //mock valid user input
        const new_invalid_user = {
            "name": "Diego",
            "email": "",
            "password": "secret"
        }
        //send request to the app
        chai.request(app).post(`${version}/register`)
            .send(new_invalid_user)
            .then((res) => {
                //console.log(res.body);
                //assertions
                expect(res).to.have.status(401)
                expect(res.body.errors.length).to.be.equal(1);
                done();
            }).catch(err => {
                console.log(err.message);
            })
    });
});
describe('User login', () => {
    it('should return 200 and token for valid credentials', (done) => {
        //mock invalid user input
        const valid_input = {
            "email": "diegoarturosilva@hotmail.com",
            "password": "secret"
        }
        //send request to the app
        chai.request(app).post(`${version}/login`)
            .send(valid_input)
            .then((res) => {
                //console.log(res.body);
                //assertions
                expect(res).to.have.status(200);
                expect(res.body.token).to.exist;
                expect(res.body.message).to.be.equal("Auth OK");
                expect(res.body.errors.length).to.be.equal(0);
                done();
            }).catch(err => {
                console.log(err.message);
            })
    });
});
describe('Protected route', () => {

	it('should return 200 and user details if valid token provided', (done) => {
		//mock login to get token
		const valid_input = {
			"email": "diegoarturosilva@hotmail.com",
			"password": "secret"
		}
		//send login request to the app to receive token
		chai.request(app).post(`${version}/login`)
			.send(valid_input)
				.then((login_response) => {
					//add token to next request Authorization headers as Bearer adw3R£$4wF43F3waf4G34fwf3wc232!w1C"3F3VR
					const token = 'Bearer ' + login_response.body.token;
					chai.request(app).get(`${version}/protected`)
						.set('Authorization', token)
						.then(protected_response => {
							//assertions
							expect(protected_response).to.have.status(200);
							expect(protected_response.body.message).to.be.equal(`Welcome, your email is ${valid_input.email}`);
							expect(protected_response.body.user.email).to.exist;
							expect(protected_response.body.errors.length).to.be.equal(0);

							done();
						}).catch(err => {
							console.log(err.message);
						});
				}).catch(err => {
					console.log(err.message);
				});
	})

});
describe('As a User', () => {
	it('should return 200 and user details if valid token provided', (done) => {
        //Given a user
		const valid_user = {
			"email": "diegoarturosilva@hotmail.com",
			"password": "secret"
		}
		//When send login request to the app to receive token
		chai.request(app).post(`${version}/login`)
            .send(valid_user)
                //Then user get a token
				.then((login_response) => {
                    const token = 'Bearer ' + login_response.body.token;

                    describe('I want to see the books present in the library',()=>{
                        describe('So that I can choose which book to borrow',()=>{
                            chai.request(app).get(`${version}/books`)
                            .set('Authorization', token)
                            .then(protected_response => {
                                //assertions
							    expect(protected_response).to.have.status(200);
                                expect(protected_response.body.items.length).to.be.equal(0);
							    expect(protected_response.body.errors.length).to.be.equal(0);
							    done();
                            }).catch(err => {
                                console.log(err.message);
                            });
                        });
                    })
				}).catch(err => {
					console.log(err.message);
				});
	})

	after((done) => {
		//stop app server
		console.log('All tests completed, stopping server....')
		process.exit();
		done();
	});

});