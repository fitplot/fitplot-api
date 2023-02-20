const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const {
  createManySets,
  getPreviousSetsForExercise,
  getSetsForWorkout,
  updateSet,
  deleteSet,
} = require('../services/set');

const sets = new Router();

sets.get(
  '/workout/:id/sets',
  validate({ params: z.object({ id: z.string() }) }),
  async (ctx) => {
    const sets = await getSetsForWorkout(ctx.params.id);
    ctx.body = sets;
  }
);

sets.get(
  '/exercise/:id/sets/previous',
  validate({
    params: z.object({ id: z.string() }),
    query: z.object({ workoutId: z.string() }),
  }),
  async (ctx) => {
    const sets = await getPreviousSetsForExercise(
      ctx.params.id,
      ctx.query.workoutId
    );
    ctx.body = sets;
  }
);

sets.post(
  '/sets',
  validate({
    body: z.array(
      z.object({
        amount: z.string(),
        exerciseId: z.string(),
        unit: z.string().default('lbs'),
        userId: z.string(),
        volume: z.string().nullable(),
        workoutId: z.string(),
      })
    ),
  }),
  async (ctx) => {
    const result = await createManySets(ctx.request.body);
    ctx.body = result;
  }
);

sets.put(
  '/workout/set/:id',
  validate({
    params: z.object({ id: z.string() }),
    body: z.object({
      amount: z.string(),
      unit: z.string().default('lbs'),
      volume: z.string().nullable(),
    }),
  }),
  async (ctx) => {
    const result = await updateSet(ctx.params.id, ctx.request.body);
    ctx.body = result;
  }
);

sets.delete(
  '/workout/set/:id',
  validate({
    params: z.object({ id: z.string() }),
  }),
  async (ctx) => {
    await deleteSet(ctx.params.id);
    ctx.body = { id: ctx.params.id };
  }
);

module.exports = sets;
