const Router = require('@koa/router');

const auth = require('./auth');
const exercise = require('./exercise');
const exercises = require('./exercises');
const healthcheck = require('./healthcheck');
const sets = require('./sets');
const units = require('./units');
const waitlist = require('./waitlist');
const workout = require('./workout');
const workouts = require('./workouts');

const routes = new Router();
routes.use(auth.middleware());
routes.use(exercise.middleware());
routes.use(exercises.middleware());
routes.use(healthcheck.middleware());
routes.use(sets.middleware());
routes.use(units.middleware());
routes.use(waitlist.middleware());
routes.use(workout.middleware());
routes.use(workouts.middleware());
routes.prefix('/api');

module.exports = routes;
