const Router = require('@koa/router');
const z = require('zod');

const { validate, user } = require('../middleware');
const { getWorkoutsForUser } = require('../services/workout');

const workouts = new Router();

workouts.get(
  '/workouts',
  validate({
    query: z.object({
      take: z.coerce.number().default(10),
      cursor: z.string().optional(),
    }),
  }),
  user({ required: true }),
  async (ctx) => {
    const { take, cursor } = ctx.query;
    const workouts = await getWorkoutsForUser(ctx.user.id, {
      take,
      cursor,
    });

    const last = workouts.length > 0 ? workouts.at(-1) : null;

    ctx.body = {
      workouts,
      cursor: last ? last.id : null,
    };
  },
);

module.exports = workouts;
