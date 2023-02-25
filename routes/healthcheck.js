const Router = require('@koa/router');

const { getBuildId } = require('../lib/server');
const pkg = require('../package.json');

const healthcheck = new Router();

healthcheck.get('/healthcheck', (ctx) => {
  ctx.status = 204;
});

healthcheck.get('/liveliness', async (ctx) => {
  ctx.body = {
    app: pkg.name,
    version: getBuildId(),
  };
});

module.exports = healthcheck;
