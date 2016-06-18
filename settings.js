var settings,
	environment = process.env.NODE_ENV;

if(environment === 'development'){
	settings = {
		facebookCredentials: {
			clientID: '1109550759112324',
			clientSecret: '239aa8dca5ff2052f80bf3bf19d49226',
		}
	};
}else if(environment === 'production'){
	settings = {
		facebookCredentials: {
			clientID: '1109547295779337',
			clientSecret: 'f5332ef203e5c7a46545599083d53bff',
		}
	};
}else{
	throw new Error('Invalid NODE_ENV Specified');
}

exports.settings = settings;