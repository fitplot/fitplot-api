const Router = require('@koa/router');
const z = require('zod');

const { validate } = require('../middleware');
const {
  getWorkoutsForUser,
  getTotalWorkoutsForUser,
} = require('../services/workout');

const workouts = new Router();

workouts.get(
  '/workouts',
  validate({ query: z.object({ userId: z.string() }) }),
  async (ctx) => {
    const workouts = await getWorkoutsForUser(ctx.query.userId);
    ctx.body = workouts;
  }
);

workouts.get(
  '/workouts/summary',
  validate({
    query: z.object({ userId: z.string(), take: z.coerce.number().default(8) }),
  }),
  async (ctx) => {
    const workouts = await getWorkoutsForUser(ctx.query.userId, {
      take: ctx.query.take,
      orderBy: { createdAt: 'desc' },
    });
    const { _all: total, completedAt: totalCompleted } =
      await getTotalWorkoutsForUser(ctx.query.userId);
    ctx.body = {
      workouts,
      total,
      totalCompleted,
    };
  }
);

module.exports = workouts;
