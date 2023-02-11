const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const { createSetForWorkout, getSetsForWorkout } = require('../services/sets');

const sets = new Router();

sets.get(
  '/workout/:id/sets',
  validate({ params: z.object({ id: z.string() }) }),
  async (ctx) => {
    const sets = await getSetsForWorkout(ctx.params.id);
    ctx.body = sets;
  }
);

sets.post(
  '/workout/:id/sets',
  validate({
    params: z.object({ id: z.string() }),
    body: z.object({
      amount: z.string(),
      exerciseId: z.string(),
      unit: z.string(),
      userId: z.string(),
      volume: z.string(),
      workoutId: z.string(),
    }),
  }),
  async (ctx) => {
    const set = await createSetForWorkout(ctx.body);
    ctx.body = set;
  }
);

module.exports = sets;
