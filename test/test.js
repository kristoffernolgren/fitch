var fb =		require('../config.js').settings.facebookCredentials,
	assert =	require('assert'),
	request =	require('request-promise'),
	rider = {},
	driver = {},
	req = (user, uri, form, method = 'POST') => {
		options = {
			method: method,
			body: {
				some: 'payload'
			},
			headers: {
				access_token: user.access_token
			},
			uri: uri,
			json: true,
			form: form
		};
		return request(options);
	};

describe('Facebook', () => {
	describe('Get facebook auth keys', () => {
		it('Should access facebook', function(done) {
			this.timeout(10000);
			var uri = 'https://graph.facebook.com/v2.6/1109550759112324/accounts/test-users';
			Promise.all([
				req(rider, uri, {installed: true, access_token: fb.clientID+'|'+fb.clientSecret}),
				req(rider, uri, {installed: true, access_token: fb.clientID+'|'+fb.clientSecret})
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


describe('Read driver', () => {
	it('Should authenticate', (done) =>{

	req(driver, 'http://localhost:3000/user/me', {}, 'GET')
		.then((body) => {
			driver.id = body.user.id;
			driver.name = body.user.name;
			done();
		});
	});
	it('Should have a name', ()=> {
		assert(Boolean(driver.name));
	});
	it('Should have an ID', ()=> {
		assert(Boolean(driver.id));
	});

});

describe('Edit rider', () => {
	it('Should update name', (done) => {
		req(rider, 'http://localhost:3000/user/me', {name: 'newName'})
			.then((body) => {
				assert.equal('newName', body.user.name);
				done();
			});
	});
});

describe('Invalid', () => {
	describe('user updates', () => {
		it('Should fail creating a hail when missing phone', (done) => {
			req(rider,'http://localhost:3000/hail/create', {lat: 1.5, lon: 1.5})
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
			req(driver, 'http://localhost:3000/user/me', {driverrequest: true})
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
				req(rider, 'http://localhost:3000/user/me', {
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
	it('Should allow not allow rider to search', (done) => {
		req(rider, 'http://localhost:3000/hail/search/')
		.then((resp)=> {
			assert(false);
			done();
		}).catch((err) => {
			assert.equal(1, err.error.errors.length);
			done();
		});
	});
});

describe('Creating Hail', () => {
	it('Should add credit Card and phoneNumber', (done) => {
		req(rider, 'http://localhost:3000/user/me', {
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
		req(rider,'http://localhost:3000/hail/create', {lat: -500} )
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
		req(rider, 'http://localhost:3000/hail/create', {lat: 1.5, lon: 1.5})
			.then((body)=> {
				assert(Boolean(body.hail));
				done();
			});
	});
	it('Sholud cancel a hail', (done)=> {
		req(rider, 'http://localhost:3000/hail/cancel')
			.then((body)=> {
				assert(!Boolean(body.hail));
				done();
			});
	});
	it('Should create another hail', (done)=> {
		req(rider, 'http://localhost:3000/hail/create', {lat: 1.5, lon: 1.5})
			.then((body)=> {
				assert(Boolean(body.hail));
				done();
			});
	});
	it('Should fail to complete this hail, because driver is not driver', (done) => {
		req(rider, 'http://localhost:3000/hail/complete', {
			id: driver.id
		}).then(()=>{
			assert('false');
			done();
		}).catch((err)=>{
			assert.equal(1, err.error.errors.length);
			done();
		});
	});
});

describe('Become Driver', () => {
	it('Should create request for becomming a driver', (done) => {
		req(driver, 'http://localhost:3000/user/me',
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
	it('Should make driver admin', (done) => {
		req(driver, 'http://localhost:3000/user/'+driver.id+'/',{
			admin: true,
			secret: 'catballs'
		})
		.then((resp) => {
			done();
		});
	});
	it('Should make driver driver', (done) => {
		req(driver, 'http://localhost:3000/user/'+driver.id+'/',{
			driver: true
		}).then((resp)=> {
			done();
		});
	});
	it('Should allow driver to search', (done) => {
		req(driver, 'http://localhost:3000/hail/search/').then((resp)=> {
			assert(resp.result.length > 0);
			done();
		});
	});
});

describe('Complete hail', () => {
	it('Should complete the hail', (done) => {
		req(rider, 'http://localhost:3000/hail/complete/', {
			id: driver.id
		}).then((resp) => {
			assert(!Boolean(resp.hail));
			done();
		});
	});
});