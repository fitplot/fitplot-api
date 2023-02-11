const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const {
  createExercise,
  getExercise,
  updateExercise,
} = require('../services/exercise');

const exercise = new Router();

exercise.get(
  '/exercise/:id',
  validate({ params: z.object({ id: z.string() }) }),
  async (ctx) => {
    const exercise = await getExercise(ctx.params.id);
    ctx.body = exercise;
  }
);

exercise.post(
  '/exercise',
  validate({
    body: z.object({
      name: z.string(),
      userId: z.string(),
    }),
  }),
  async (ctx) => {
    const exercise = await createExercise(ctx.body);
    ctx.body = exercise;
  }
);

exercise.put(
  '/exercise/:id',
  validate({
    params: z.object({ id: z.string() }),
    body: z.object({
      name: z.string(),
    }),
  }),
  async (ctx) => {
    const exercise = await updateExercise(ctx.params.id, ctx.body);
    ctx.body = exercise;
  }
);

module.exports = exercise;
