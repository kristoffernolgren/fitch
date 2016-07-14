var fb =		require('../config.js').settings.facebookCredentials,
	assert =	require('assert'),
	request =	require('request-promise'),
	app = {access_token: fb.clientID+'|'+fb.clientSecret},
	rider = {},
	driver = {},
	post = (user, uri, form = {}) => {
		options = {
			method: 'POST',
			body: {
				some: 'payload'
			},
			uri: uri,
			json: true,
			form: form
		};
		options.form.access_token = user.access_token;
		return request(options);
	};

describe('Facebook', () => {
	describe('Get facebook auth keys', () => {
		it('Should access facebook', function(done) {
			this.timeout(10000);
			var uri = 'https://graph.facebook.com/v2.6/1109550759112324/accounts/test-users';
			Promise.all([
				post(app, uri, {installed: true}),
				post(app, uri, {installed: true})
			]).then((resp) => {
				rider.access_token = resp[0].access_token;
				driver.access_token = resp[1].access_token;
				done();
			});
		});

		it('Should return access_tokens', () => {
			assert(Boolean(rider.access_token));
			assert(Boolean(driver.access_token));
		});
	});
});


describe('Read rider', () => {
	it('Should authenticate', (done) =>{

	post(rider, 'http://localhost:3000/user/me')
		.then((body) => {
			rider.id = body.user.id;
			rider.name = body.user.name;
			done();
		});
	});
	it('Should have a name', ()=> {
		assert(Boolean(rider.name));
	});
	it('Should have an ID', ()=> {
		assert(Boolean(rider.id));
	});

});

describe('Edit rider', () => {
	it('Should update name', (done) => {
		post(rider, 'http://localhost:3000/user/me', {name: 'newName'})
			.then((body) => {
				assert.equal('newName', body.user.name);
				done();
			});
	});
});

describe('Invalid', () => {
	describe('user updates', () => {
		it('Should fail creating a hail when missing phone', (done) => {
			post(rider,'http://localhost:3000/hail/create', {lat: 1.5, lon: 1.5})
				.then(() => {
					assert(false);
					done();
				})
				.catch((err) => {
					assert.equal(2, err.error.errors.length);
					done();
				});
		});
		it('Should fail becoming a driver when missing parameters', (done) => {
			post(driver, 'http://localhost:3000/user/me', {driverrequest: true})
				.then(() => {
					assert(false);
					done();
				})
				.catch((err) => {
					assert.equal(3,err.error.errors.length);
					done();
				});
		});
	});
	describe('Cards', ()=>{
		it('should fail to add invalid card', (done) => {
				post(rider, 'http://localhost:3000/user/me', {
				exp_month: "02",
				exp_year: "22",
				number: "4242424242424241",
				cvc: "123",
			}).then((body) => {
				assert(false);
				done();
			}).catch((err) => {
				assert(err.error.errors[0].msg === 'Your card number is incorrect.');
				done();
			});
		});

	});
});

describe('Creating Hail', () => {
	it('Should add credit Card and phoneNumber', (done) => {
		post(rider, 'http://localhost:3000/user/me', {
			exp_month: "02",
			exp_year: "22",
			number: "4000007520000008",
			cvc: "123",
			phone: "123"
		}).then((resp)=> {
				assert(resp.user.creditcard);
				assert(Boolean(resp.user.phone));
				done();
			});
	});
	it('Should fail when ouside permitted area and missing lon.', (done) => {
		post(rider,'http://localhost:3000/hail/create', {lat: -500} )
			.then(()=>{
				assert(false);
				done();
			})
			.catch((err) => {
				assert.equal(3, err.error.errors.length);
				done();
			});

	});
	it('Should create a hail', (done)=> {
		post(rider, 'http://localhost:3000/hail/create', {lat: 1.5, lon: 1.5})
			.then((body)=> {
				assert(Boolean(body.hail));
				done();
			});
	});
	it('Sholud cancel a hail', (done)=> {
		post(rider, 'http://localhost:3000/hail/cancel')
			.then((body)=> {
				assert(!Boolean(body.hail));
				done();
			});
	});
});


describe('Become Driver', () => {
	it('Should create request for becomming a driver', (done) => {
		post(driver, 'http://localhost:3000/user/me',
			{
				driverrequest: 'true',
				bank:'asdf',
				bankNo: '123',
				phone: '123'
			})
			.then((resp) => {
				assert.equal('true', resp.user.driverRequest);
				done();
			});
		});
});