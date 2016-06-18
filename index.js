var express = require('express'),
	app = express(),
	passport = require('./passport.js').passport;

app.use(passport.initialize());


app.get('/auth/facebook',  passport.authenticate('facebook',  { session: false }));

app.get('/auth/facebook/callback',
	passport.authenticate('facebook',
	{
		session: false,
		successRedirect: '/auth/facebook/complete',
		failureRedirect: '/auth/facebook/fail'
	})
);

app.get('/auth/facebook/complete', (req, res) => {
	res.send('FB Auth complete');
});

app.get('/auth/facebook/fail', (req, res) => {
	res.send('FB Auth failed');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});