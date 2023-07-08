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
    // User is already logged-in
    if (ctx.user) {
      ctx.status = 204;
      return;
    }

    const email = ctx.request.body.email;
    const user = await getUserByEmail(email);

    const host = ctx.headers['X-Forwarded-Host'] || ctx.headers['host'];
    const protocol = host.includes('localhost')
      ? 'http'
      : ctx.headers['X-Forwarded-Proto'] || 'https';
    const domainUrl = `${protocol}://${host}`;

    console.info(
      'Login request received with domainUrl=',
      domainUrl,
      'X-Forwarded-Host',
      ctx.headers['X-Forwarded-Host'],
      'host',
      ctx.headers['host'],
      'X-Forwarded-Proto',
      ctx.headers['X-Forwarded-Proto']
    );

    if (!user) {
      ctx.status = 401;
      ctx.body = 'Unauthorized';
      return;
    }

    const magicLink = getMagicLink({
      email,
      domainUrl: '', // TODO: `domainUrl`,
    });

    sendMagicLink({ email, magicLink });

    ctx.body = 'OK';
  }
);

router.post(
  '/sign-up',
  validate({
    body: z.object({ email: z.string().email(), firstName: z.string() }),
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
