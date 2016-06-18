var express = require('express'),
	app = express(),
	passport = require('./passport.js').passport;

require('./database.js')

app.use(passport.initialize());
app.use(express.static('public'));


app.get('/auth/facebook',  passport.authenticate('facebook-token',  { session: false }),
	(req, res) => {
    // do something with req.user
    res.send(req.user? 200 : 401);
});
