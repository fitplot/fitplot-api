const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const { createSet, getSetsForWorkout } = require('../services/set');

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
      amount: z.string().default('0'),
      exerciseId: z.string(),
      unit: z.string().default('lbs'),
      userId: z.string(),
      volume: z.string().default('0'),
      workoutId: z.string(),
    }),
  }),
  async (ctx) => {
    const set = await createSet(ctx.request.body);
    ctx.body = set;
  }
);

module.exports = sets;
