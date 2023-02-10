const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');

const workouts = new Router();
workouts.get(
  '/workouts',
  validate({ query: z.object({ userId: z.coerce.number() }) }),
  async (ctx) => {
    // TODO: get workouts
    const workouts = {};

    ctx.body = workouts;
  }
);

module.exports = workouts;
