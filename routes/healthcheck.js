const Router = require('@koa/router');

const { getBuildId } = require('../lib/server');
const pkg = require('../package.json');

const healthcheck = new Router();
healthcheck.get('/healthcheck', async (ctx) => {
  ctx.body = {
    app: pkg.name,
    version: getBuildId(),
  };
});

module.exports = healthcheck;
