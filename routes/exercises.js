const Router = require('@koa/router');
const z = require('zod');

const { user, validate } = require('../middleware');
const { getExercisesForUser } = require('../services/exercise');

const exercises = new Router();

exercises.get(
  '/exercises',
  user({ required: true }),
  validate({
    query: z.object({
      take: z.coerce.number().default(10),
      cursor: z.string().optional(),
      query: z.string().optional(),
    }),
  }),
  async (ctx) => {
    const { take, cursor, query } = ctx.query;
    const exercises = await getExercisesForUser(ctx.user.id, {
      take,
      cursor,
      query,
    });

    const last = exercises.length > 0 ? exercises.at(-1) : null;

    ctx.body = {
      exercises,
      cursor: last ? last.id : null,
    };
  },
);

module.exports = exercises;
