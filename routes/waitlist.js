const Router = require('@koa/router');
const z = require('zod');

const { ratelimit, user, validate } = require('../middleware');
const { getUserByEmail } = require('../services/user');
const { addToWaitlist } = require('../services/waitlist');

const router = new Router();

router.post(
  '/waitlist',
  ratelimit,
  validate({
    body: z.object({
      email: z.string().email(),
      firstName: z.string().min(1),
    }),
  }),
  user(),
  async (ctx) => {
    // User is already signed-in, they don't need to waitlist.
    if (ctx.user) {
      ctx.status = 204;
      return;
    }

    const email = ctx.request.body.email;
    const user = await getUserByEmail(email);

    // User is already signed-up, they don't need to waitlist.
    if (user) {
      ctx.status = 204;
      return;
    }

    try {
      const { id } = await addToWaitlist({
        email,
        firstName: ctx.request.body.firstName,
      });
      ctx.body = { id };
    } catch (error) {
      // User is already on the waitlist.
      if (error.code === 'P2002') {
        ctx.status = 204;
        return;
      }

      throw error;
    }
  },
);

module.exports = router;
