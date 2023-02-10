const Router = require('@koa/router');

const healthcheck = require('./healthcheck');
const workout = require('./workout');
const workouts = require('./workouts');

const routes = new Router();
routes.use(healthcheck.middleware());
routes.use(workout.middleware());
routes.use(workouts.middleware());
routes.prefix('/api');

module.exports = routes;
