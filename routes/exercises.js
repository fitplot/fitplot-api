const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const { getExercisesForUser } = require('../services/exercise');

const exercises = new Router();

exercises.get(
  '/exercises',
  validate({ query: z.object({ userId: z.string() }) }),
  async (ctx) => {
    const exercise = await getExercisesForUser(ctx.query.userId);
    ctx.body = exercise;
  }
);

module.exports = exercises;
