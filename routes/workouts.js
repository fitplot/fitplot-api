const Router = require('@koa/router');
const z = require('zod');

const { validate, user } = require('../middleware');
const {
  getWorkoutsForUser,
  getTotalWorkoutsForUser,
} = require('../services/workout');

const workouts = new Router();

workouts.get('/workouts', user({ required: true }), async (ctx) => {
  const workouts = await getWorkoutsForUser(ctx.user.id);
  ctx.body = workouts;
});

workouts.get(
  '/workouts/summary',
  validate({
    query: z.object({ take: z.coerce.number().default(4) }),
  }),
  user({ required: true }),
  async (ctx) => {
    const workouts = await getWorkoutsForUser(ctx.user.id, {
      take: ctx.query.take,
      orderBy: { createdAt: 'desc' },
    });
    const { _all: total, completedAt: totalCompleted } =
      await getTotalWorkoutsForUser(ctx.user.id);
    ctx.body = {
      workouts,
      total,
      totalCompleted,
    };
  }
);

module.exports = workouts;
