const Router = require('@koa/router');

const pkg = require('../package.json');

const healthcheck = new Router();
healthcheck.get('/healthcheck', async (ctx) => {
  try {
    ctx.body = `${pkg.name}`;
  } catch (e) {
    console.error(e);
  }
});

module.exports = healthcheck;
