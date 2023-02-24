const Router = require('@koa/router');
const z = require('zod');

const { user } = require('../middleware');
const { getExercisesForUser } = require('../services/exercise');

const exercises = new Router();

exercises.get('/exercises', user({ required: true }), async (ctx) => {
  const exercise = await getExercisesForUser(ctx.user.id);
  ctx.body = exercise;
});

module.exports = exercises;
