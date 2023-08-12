const Router = require('@koa/router');
const z = require('zod');

const { validate, user } = require('../middleware');
const {
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} = require('../services/workout');

const workout = new Router();

workout.get(
  '/workout/:id',
  validate({ params: z.object({ id: z.string() }) }),
  user({ required: true }),
  async (ctx) => {
    const workout = await getWorkout({
      id: ctx.params.id,
      userId: ctx.user.id,
    });
    ctx.body = workout;
  },
);

workout.post(
  '/workout',
  validate({ body: z.object({ name: z.string() }) }),
  user({ required: true }),
  async (ctx) => {
    const data = ctx.request.body;
    data.userId = ctx.user.id;
    const workout = await createWorkout(data);
    ctx.body = workout;
  },
);

workout.put(
  '/workout/:id',
  validate({
    params: z.object({ id: z.string() }),
    body: z.object({
      name: z.string().optional(),
      completedAt: z.string().nullable().optional(),
    }),
  }),
  user({ required: true }),
  async (ctx) => {
    const workout = await updateWorkout(
      { id: ctx.params.id, userId: ctx.user.id },
      ctx.request.body,
    );
    ctx.body = workout;
  },
);

workout.delete(
  '/workout/:id',
  validate({
    params: z.object({ id: z.string() }),
  }),
  user({ required: true }),
  async (ctx) => {
    await deleteWorkout({ id: ctx.params.id, userId: ctx.user.id });
    ctx.body = { id: ctx.params.id };
  },
);

module.exports = workout;
