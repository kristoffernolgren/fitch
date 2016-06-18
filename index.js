var express = require('express'),
	app = express(),
	passport = require('./passport.js').passport;

app.get('/test',  passport.authenticate('local',  { session: false }), (req, res, next) => {
	next();
});

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});