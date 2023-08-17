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
  validate({ params: z.object({ id: z.string().min(12).max(12) }) }),
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
    params: z.object({ id: z.string().min(12).max(12) }),
    query: z.object({ workoutId: z.string().min(12).max(12) }),
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
        amount: z.coerce.number().nullable(),
        exerciseId: z.string().min(12).max(12),
        unitId: z.string().min(12).max(12),
        volume: z.coerce.number(),
        workoutId: z.string().min(12).max(12),
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
    params: z.object({ id: z.string().min(12).max(12) }),
    body: z.object({
      amount: z.coerce.number().nullable(),
      unitId: z.string().min(12).max(12),
      volume: z.coerce.number(),
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
    params: z.object({ id: z.string().min(12).max(12) }),
  }),
  user({ required: true }),
  async (ctx) => {
    await deleteSet({ id: ctx.params.id, userId: ctx.user.id });
    ctx.body = { id: ctx.params.id };
  },
);

module.exports = sets;
