const router = require('koa-joi-router');

const healthcheck = require('./healthcheck');

const routes = router();
routes.use(healthcheck.middleware());
routes.prefix('/api');

module.exports = routes;
