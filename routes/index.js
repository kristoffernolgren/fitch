var app =		require('../app.js').app,
	c =			require('../controllers/'),
	render =	require('./output.js').render;

app.get('/user/me',			c.auth, render);
app.post('/user/me',		c.auth,	c.striper.make,		c.user.edit,		c.user.requestDriver,		render);
app.post('/user/:id',		c.auth, c.user.makeDriver,	c.user.makeAdmin,			render);

app.get('/hail/',			c.auth,	c.hail.search,		render);
app.post('/hail/create',	c.auth,	c.hail.create,		render);
app.post('/hail/complete',	c.auth,	c.hail.complete,	c.striper.charge, render);
app.post('/hail/cancel',	c.auth,	c.hail.cancel,		render);