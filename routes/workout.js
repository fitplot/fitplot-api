const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');

const workout = new Router();
workout.get('/workout/:id', validate({ params: z.object({ id: z.string() }) }), async (ctx) => {
  // TODO: get workout
  const workout = { id: ctx.params.id };

  ctx.body = workout;
});

module.exports = workout;
