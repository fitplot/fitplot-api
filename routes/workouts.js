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
      from: z.coerce.date().optional(),
      to: z.coerce.date().optional(),
    }),
  }),
  user({ required: true }),
  async (ctx) => {
    const { take, cursor, from, to } = ctx.query;
    const workouts = await getWorkoutsForUser(ctx.user.id, {
      take,
      cursor,
      from,
      to,
    });

    const last = workouts.length ? workouts[workouts.length - 1] : null;

    ctx.body = {
      workouts,
      cursor: last ? last.id : undefined,
    };
  }
);

module.exports = workouts;
