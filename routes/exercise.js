const Router = require('@koa/router');
const {
  PrismaClientKnownRequestError,
} = require('@prisma/client/runtime/library');
const z = require('zod');

const { validate, user } = require('../middleware');
const {
  createExercise,
  deleteExercise,
  getExercise,
  updateExercise,
} = require('../services/exercise');
const { updateManySets } = require('../services/set');

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

router.delete(
  '/exercise/:id',
  validate({
    body: z.object({ id: z.string() }),
    query: z.object({ reassignTo: z.string().optional() }),
  }),
  user({ required: true }),
  async (ctx) => {
    if (ctx.query.reassignTo) {
      await updateManySets({
        userId: ctx.user.id,
        fromExerciseId: ctx.request.body.id,
        toExerciseId: ctx.query.reassignTo,
      });
    }

    try {
      const { id } = await deleteExercise({
        id: ctx.params.id,
        userId: ctx.user.id,
      });
      ctx.body = { id };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2014'
      ) {
        const { code, meta } = error;
        ctx.status = 409;
        ctx.body = {
          error: [
            {
              name: 'Delete is restricted.',
              issues: [
                {
                  code,
                  meta,
                },
              ],
            },
          ],
        };
        return;
      }

      ctx.throw(error);
    }
  }
);

module.exports = router;
