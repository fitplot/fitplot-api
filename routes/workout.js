const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const {
  getWorkout,
  createWorkout,
  updateWorkout,
} = require('../services/workout');

const workout = new Router();

workout.get(
  '/workout/:id',
  validate({ params: z.object({ id: z.string() }) }),
  async (ctx) => {
    const workout = await getWorkout(ctx.params.id);
    ctx.body = workout;
  }
);

workout.post(
  '/workout',
  validate({ body: z.object({ name: z.string(), userId: z.string() }) }),
  async (ctx) => {
    const workout = await createWorkout(ctx.request.body);
    ctx.body = workout;
  }
);

workout.put(
  '/workout/:id',
  validate({
    params: z.object({ id: z.string() }),
    body: z.object({ name: z.string() }),
  }),
  async (ctx) => {
    const workout = await updateWorkout(ctx.params.id, ctx.body);
    ctx.body = workout;
  }
);

module.exports = workout;
