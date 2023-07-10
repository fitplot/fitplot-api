const session = require('koa-session');

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 365; // one year

const CONFIG = {
  key: 'nexus.session',
  maxAge: SESSION_EXPIRATION_TIME / 1000,
  httpOnly: true,
  sameSite: 'lax',
};

exports = module.exports = (app) => session(CONFIG, app);
exports.SESSION_EXPIRATION_TIME = SESSION_EXPIRATION_TIME;
