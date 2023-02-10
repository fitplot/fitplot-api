const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const { getWorkout } = require('../services/workout');

const workout = new Router();
workout.get('/workout/:id', validate({ params: z.object({ id: z.string() }) }), async (ctx) => {
  const workout = await getWorkout(ctx.params.id);
  ctx.body = workout;
});

module.exports = workout;
