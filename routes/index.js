var app =		require('../app.js').app,
	c =			require('../controllers/'),
	render =	require('./output.js').render;

app.post('/user/me',		c.auth,	c.striper.make,		c.user.edit,		render);
app.post('/user/:id',		c.auth, c.targetUser,		c.user.admin,		render);

app.post('/hail/create',		c.auth,	c.hail.create,		render);
app.post('/hail/search',		c.auth,	c.hail.search,		render);
app.post('/hail/complete',	c.auth,	c.targetUser,		c.hail.complete,	c.striper.charge, render);
app.post('/hail/cancel',		c.auth,	c.hail.cancel,		render);

