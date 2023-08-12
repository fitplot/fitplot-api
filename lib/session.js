const session = require('koa-session');

const SESSION_EXPIRATION_TIME = 60 * 60 * 24 * 365 * 1000; // one year

const CONFIG = {
  // todo: someday bite the bullet and replace `nexus` with `fitplot`
  key: 'nexus.session',
  maxAge: SESSION_EXPIRATION_TIME,
  httpOnly: true,
  sameSite: 'lax',
};

exports = module.exports = (app) => session(CONFIG, app);
exports.SESSION_EXPIRATION_TIME = SESSION_EXPIRATION_TIME;
