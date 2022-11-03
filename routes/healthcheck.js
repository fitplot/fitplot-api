const router = require('koa-joi-router');

const pkg = require('../package.json');

const healthcheck = router();
healthcheck.get('/healthcheck', async (ctx) => {
  try {
    ctx.body = `${pkg.name}`;
  } catch (e) {
    console.error(e);
  }
});

module.exports = healthcheck;
