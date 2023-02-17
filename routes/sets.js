const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const { createManySets, getSetsForWorkout } = require('../services/set');

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
  '/workout/sets',
  validate({
    body: z.array(
      z.object({
        amount: z.string().default('0'),
        exerciseId: z.string(),
        unit: z.string().default('lbs'),
        userId: z.string(),
        volume: z.string().default('0'),
        workoutId: z.string(),
      })
    ),
  }),
  async (ctx) => {
    const result = await createManySets(ctx.request.body);
    ctx.body = result;
  }
);

module.exports = sets;
