var app =		require('../app.js').app,
	c =			require('../controllers/'),
	render =	require('./output.js').render;

app.get('/hail/create',		c.auth,					c.hail.create,		render);
app.get('/hail/search',		c.auth,					c.hail.search,		render);
app.get('/hail/complete',	c.auth, c.targetUser,	c.hail.complete,	render);
app.get('/hail/cancel',		c.auth,					c.hail.cancel,		render);

app.get('/user/me',			c.auth,					c.user.edit,		render);
app.get('/user/:id',		c.auth, c.targetUser,	c.user.admin,		render);