var env, settings;
env = process.env.NODE_ENV;
env = Boolean(env) ? env:'development';

settings = require('./config/'+env+'.json');
exports.settings = settings;