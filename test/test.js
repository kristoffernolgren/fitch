var fb =		require('../config.js').settings.facebookCredentials,
	assert =	require('assert'),
	request =	require('request-promise'),
	rider = {},
	driver = {},
	req = (user, uri, form, method = 'POST') => {
		if(uri.substring(0,8) !== 'https://' && uri.substring(0,7) !== 'http://' ){
			uri = 'http://localhost:3000'+uri;
		}
		options = {
			method: method,
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
	it('Should access facebook', function() {
		this.timeout(20000);
		var uri = 'https://graph.facebook.com/v2.6/1109550759112324/accounts/test-users';
		return Promise.all([
			req(rider, uri, {installed: true, access_token: fb.clientID+'|'+fb.clientSecret}),
			req(rider, uri, {installed: true, access_token: fb.clientID+'|'+fb.clientSecret})
		]).then((resp) => {
			rider.access_token = resp[0].access_token;
			rider.fbid = resp[0].id;
			driver.access_token = resp[1].access_token;
			driver.fbid = resp[1].id;
		});
	});

	it('Should return access_tokens', () => {
		assert(Boolean(rider.access_token));
		assert(Boolean(driver.access_token));
	});
});


describe('Read driver', () => {
	it('Should authenticate', () =>{
	return req(driver, '/user/me', {}, 'GET')
		.then((body) => {
			driver.id = body.user.id;
			driver.name = body.user.name;
		});
	});
	it('Should have a name', ()=> assert(Boolean(driver.name)));
	it('Should have an ID', ()=> assert(Boolean(driver.id)));

});

describe('Edit rider', () => {
	it('Should update name', () => {
		return req(rider, '/user/me', {name: 'newName'})
			.then((body) => assert.equal('newName', body.user.name));
	});
});

describe('Invalid', () => {
	describe('user updates', () => {
		it('Should fail creating a hail when missing phone', () => {
			return req(rider,'/hail/create', {lat: 1.5, lon: 1.5})
				.then(() => {
					assert(false);
				}, err => {
					assert.equal(2, err.error.errors.length);
				});
		});
		it('Should fail becoming a driver when missing parameters', () => {
			return req(driver, '/user/me', {driverrequest: true})
				.then(() => {
					assert(false);
				}, err => {
					assert.equal(3,err.error.errors.length);
				});
		});
	});
	describe('Cards', ()=>{
		it('should fail to add invalid card', () => {
			return req(rider, '/user/me', {
				exp_month: "02",
				exp_year: "22",
				number: "4242424242424241",
				cvc: "123",
			}).then((body) => {
				assert(false);
			}, err => {
				assert(err.error.errors[0].msg === 'Your card number is incorrect.');
			});
		});

	});
	it('Should allow not allow rider to search', () => {
		return req(rider, '/hail/', {}, 'GET')
			.then((resp)=> {
				assert(false);
			}, err => {
				assert.equal(1, err.error.errors.length);
			});
	});
});

describe('Creating Hail', () => {
	it('Should add Credit Card and phoneNumber', () => {
		return req(rider, '/user/me', {
			exp_month: "02",
			exp_year: "22",
			number: "4000007520000008",
			cvc: "123",
			phone: "123"
		}).then((resp)=> {
			assert(resp.user.creditcard);
			assert(Boolean(resp.user.phone));
		});
	});
	it('Should fail when ouside permitted area and missing lon.', () => {
		return req(rider,'/hail/create', {lat: -500} )
			.then(()=>{
				assert(false);
			}, err => {
				assert.equal(3, err.error.errors.length);
			});

	});
	it('Should create a hail', ()=> {
		return req(rider, '/hail/create', {lat: 1.5, lon: 1.5})
			.then((body) => assert(Boolean(body.hail)));
	});
	it('Sholud cancel a hail', ()=> {
		return req(rider, '/hail/cancel')
			.then((body) => assert(!Boolean(body.hail)));
	});
	it('Should create another hail', ()=> {
		return req(rider, '/hail/create', {lat: 1.5, lon: 1.5})
			.then((body) => assert(Boolean(body.hail)));
	});
	it('Should fail to complete this hail, because driver is not driver', () => {
		return req(rider, '/hail/complete', {
			id: driver.id
		}).then(() => {
			assert(false);
			}, err => {
				assert.equal(1, err.error.errors.length);
			});
	});
});

describe('Become Driver', () => {
	it('Should create request for becomming a driver', () => {
		return req(driver, '/user/me',
			{
				driverrequest: 'true',
				bank:'asdf',
				bankNo: '123',
				phone: '123'
			})
			.then((resp) => assert.equal('true', resp.user.driverRequest));
		});
	it('Should make driver admin', () => {
		return req(driver, '/user/'+driver.id+'/',{
			admin: true,
			secret: 'catballs'
		});
	});
	it('Should make driver', () => {
		return req(driver, '/user/'+driver.id+'/',{
			driver: true
		});
	});
	it('Should allow driver to search', () => {
		return req(driver, '/hail/', {}, "GET")
			.then((resp)=> assert(resp.result.length > 0));
	});
});

describe('Complete hail', () => {
	it('Should complete the hail', () => {
		return req(rider, '/hail/complete/', {
			id: driver.id
		}).then((resp) => assert(!Boolean(resp.hail)));
	});
});

describe('Cleanup', ()=> {
	it('Should delete both facebook users', function(){
		this.timeout(20000);
		var uri = 'https://graph.facebook.com/v2.6/';
		Promise.all([
			req(rider,  uri+rider.fbid, {access_token: rider.access_token}, 'DELETE'),
			req(driver, uri+driver.fbid, {access_token: driver.access_token}, 'DELETE'),
		]);
	});
});