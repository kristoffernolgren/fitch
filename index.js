var express = require('express'),
	app = express(),
	passport = require('./passport.js').passport;

app.use(passport.initialize());


app.get('/auth/facebook',  passport.authenticate('facebook',  { session: false }));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});