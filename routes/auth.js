const Router = require('@koa/router');
const z = require('zod');

const { ratelimit, user, validate } = require('../middleware');
const {
  MAGIC_PARAM,
  getMagicLink,
  crackMagicLink,
} = require('../lib/magic-link');
const { sendMagicLink } = require('../lib/email');
const { createUser, getUserByEmail } = require('../services/user');
const { createSession, deleteSession } = require('../services/session');

const router = new Router();

router.post(
  '/sign-in',
  ratelimit,
  validate({ body: z.object({ email: z.string().email() }) }),
  user(),
  async (ctx) => {
    // User is already logged-in.
    if (ctx.user) {
      ctx.status = 204;
      return;
    }

    const email = ctx.request.body.email;
    const user = await getUserByEmail(email);

    // User does not exist. They need to sign-up.
    if (!user) {
      ctx.status = 401;
      ctx.body = 'Unauthorized';
      return;
    }

    const host = ctx.headers['host'];
    const protocol = host.includes('localhost')
      ? 'http'
      : ctx.headers['X-Forwarded-Proto'] || 'https';
    // TODO: get original host behind the reverse proxy in production
    const domain = host.includes('localhost') ? host : 'fitplot.io';
    const domainUrl = `${protocol}://${domain}`;

    const magicLink = getMagicLink({
      email,
      domainUrl,
    });

    sendMagicLink({ email, magicLink });

    ctx.body = 'OK';
  }
);

router.post(
  '/sign-up',
  validate({
    body: z.object({ email: z.string().email(), firstName: z.string().min(1) }),
  }),
  user(),
  async (ctx) => {
    if (ctx.user) {
      ctx.status = 204;
      return;
    }

    const user = await createUser(ctx.request.body);

    const session = await createSession({ userId: user.id });

    ctx.session.sessionId = session.id;

    ctx.body = 'OK';
  }
);

router.post('/sign-out', async (ctx) => {
  ctx.status = 204;

  if (ctx.session.sessionId) {
    await deleteSession(ctx.session.sessionId);
    ctx.status = 200;
  }

  ctx.session = null;
});

router.post(
  '/magic',
  ratelimit,
  validate({ query: z.object({ [MAGIC_PARAM]: z.string() }) }),
  async (ctx) => {
    const { email } = crackMagicLink(ctx);

    const user = await getUserByEmail(email);

    if (!user)
      return ctx.throw(404, 'This magic link is lost. Please request another.');

    const session = await createSession({ userId: user.id });
    ctx.session.sessionId = session.id;

    ctx.body = 'OK';
  }
);

router.get('/me', user({ required: true }), async (ctx) => {
  ctx.body = ctx.user;
});

module.exports = router;
