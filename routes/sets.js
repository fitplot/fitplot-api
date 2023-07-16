const Router = require('@koa/router');
const z = require('zod');

const { validate, user } = require('../middleware');
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
  user({ required: true }),
  async (ctx) => {
    const sets = await getSetsForWorkout({
      workoutId: ctx.params.id,
      userId: ctx.user.id,
    });
    ctx.body = sets;
  },
);

sets.get(
  '/exercise/:id/sets/previous',
  validate({
    params: z.object({ id: z.string() }),
    query: z.object({ workoutId: z.string() }),
  }),
  user({ required: true }),
  async (ctx) => {
    const sets = await getPreviousSetsForExercise(
      {
        exerciseId: ctx.params.id,
        userId: ctx.user.id,
      },
      ctx.query.workoutId,
    );
    ctx.body = sets;
  },
);

sets.post(
  '/sets',
  validate({
    body: z.array(
      z.object({
        amount: z.string(),
        exerciseId: z.string(),
        unit: z.string().default('lbs'),
        volume: z.string().nullable(),
        workoutId: z.string(),
      }),
    ),
  }),
  user({ required: true }),
  async (ctx) => {
    const data = ctx.request.body;

    for (const set of data) {
      set.userId = ctx.user.id;
    }

    const result = await createManySets(data);
    ctx.body = result;
  },
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
  user({ required: true }),
  async (ctx) => {
    const result = await updateSet(
      { id: ctx.params.id, userId: ctx.user.id },
      ctx.request.body,
    );
    ctx.body = result;
  },
);

sets.delete(
  '/workout/set/:id',
  validate({
    params: z.object({ id: z.string() }),
  }),
  user({ required: true }),
  async (ctx) => {
    await deleteSet({ id: ctx.params.id, userId: ctx.user.id });
    ctx.body = { id: ctx.params.id };
  },
);

module.exports = sets;
