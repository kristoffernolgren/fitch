var express = require('express'),
	app = express(),
	passport = require('./passport.js').passport
	models = require('./database'),
	env = process.env.NODE_ENV,
	settings = require('./config.json')[env];

require('./database.js');

app.use(passport.initialize());
app.use(express.static('public'));

models.sequelize.sync(settings.sync).then(() => {
	app.listen(3000);
})


app.get('/rider/auth/facebook',  passport.authenticate('facebook-token',  { session: false }),
	(req, res) => {
    // do something with req.user
    res.send(req.user? 200 : 401);
});

