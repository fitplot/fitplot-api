const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const { getWorkoutsForUser } = require('../services/workout');

const workouts = new Router();
workouts.get('/workouts', validate({ query: z.object({ userId: z.string() }) }), async (ctx) => {
  const workouts = await getWorkoutsForUser(ctx.query.userId);
  ctx.body = workouts;
});

module.exports = workouts;
