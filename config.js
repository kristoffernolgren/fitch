var env, settings;
env = process.env.NODE_ENV;
env = typeof env === "undefined"?'development':env;

settings = require('./config.json')[env];
exports.settings = settings;