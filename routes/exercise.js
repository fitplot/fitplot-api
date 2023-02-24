const Router = require('@koa/router');
const z = require('zod');

const { validate, user } = require('../middleware');
const {
  createExercise,
  getExercise,
  updateExercise,
} = require('../services/exercise');

const router = new Router();

router.get(
  '/exercise/:id',
  user({ required: true }),
  validate({ params: z.object({ id: z.string() }) }),
  async (ctx) => {
    const exercise = await getExercise({
      id: ctx.params.id,
      userId: ctx.user.id,
    });

    ctx.body = exercise;
  }
);

router.post(
  '/exercise',
  validate({
    body: z.object({
      name: z.string(),
    }),
  }),
  user({ required: true }),
  async (ctx) => {
    const exercise = await createExercise({
      ...ctx.request.body,
      userId: ctx.user.id,
    });
    ctx.body = exercise;
  }
);

router.put(
  '/exercise/:id',
  validate({
    params: z.object({ id: z.string() }),
    body: z.object({
      name: z.string(),
    }),
  }),
  user({ required: true }),
  async (ctx) => {
    const exercise = await updateExercise({
      id: ctx.params.id,
      userId: ctx.user.id,
      ...ctx.request.body,
    });
    ctx.body = exercise;
  }
);

module.exports = router;
