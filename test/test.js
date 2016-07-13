var fb =		require('../config.js').settings.facebookCredentials,
	assert =	require('assert'),
	request = require('request'),
	user = {};

describe('Facebook', () => {
	describe('Get testuser auth key', () => {
		it('Should access facebook', function(done) {
			this.timeout(10000);
			//ger inget response
			request.post('https://graph.facebook.com/v2.6/1109550759112324/accounts/test-users', {form:{
				access_token: fb.clientID+'|'+fb.clientSecret,
				installed: true}},
				function(err, res, body){
					console.log();
					assert.equal(200, res.statusCode);

					user.accessToken = JSON.parse(body).access_token;
					done();
				});
		});
		it('Should return access_token', () => {
			assert(Boolean(user.accessToken));
		});
	});
});

describe('Read user', () => {
	it('Should authenticate', (done) =>{
		request.post('http://localhost:3000/user/me', {form: {access_token:user.accessToken}},
			(err, res, body) => {
				assert.equal(200, res.statusCode);
				user.id = JSON.parse(body).user.id;
				user.name = JSON.parse(body).user.name;
				done();
			});
	});
	it('Should have a name', ()=> {
		assert(Boolean(user.name));
	});
	it('Should have an ID', ()=> {
		assert(Boolean(user.id));
	});

});

describe('Edit user', () => {
	it('Should update name', (done) => {
		request.post('http://localhost:3000/user/me', {form: {access_token:user.accessToken, name: 'newName'}},
			(err,res, body)=> {
				assert.equal('newName', JSON.parse(body).user.name);
				done();
			});
	});
});

describe('Become Rider', () => {
	it('Should fail when missing parameters', (done) => {
		request.post('http://localhost:3000/user/me', {form: {access_token:user.accessToken, driverrequest: 'true'}},
			(err, res, body) => {
				assert.equal(400, res.statusCode);
				assert(Boolean(JSON.parse(body).errors));
				done();
			});
	});
	it('Should request to become driver', (done) => {
		request.post('http://localhost:3000/user/me', {form: {
				access_token:user.accessToken,
				driverrequest: 'true',
				bank:'asdf',
				bankNo: '123',
				phone: '123'
			}},
			(err, res, body) => {
//				console.log(JSON.parse(body));
				assert.equal(200, res.statusCode);

				done();
			});
		});
});