const { getUserForSession, deleteSession } = require('../services/session');

function middleware({ required = false } = {}) {
  return async function middleware(ctx, next) {
    if (!(ctx.session && ctx.session.sessionId)) {
      if (required) {
        ctx.status = 401;
        ctx.body = 'Unauthorized';
        ctx.session = null;
        return;
      }

      ctx.user = null;
      await next(ctx);
      return;
    }

    const user = await getUserForSession(ctx.session.sessionId);

    if (required && !user) {
      await deleteSession(ctx.session.sessionId);
      ctx.session = null;
      ctx.user = null;
      ctx.status = 401;
      ctx.body = 'Unauthorized';
      return;
    }

    ctx.user = user;
    await next(ctx);
  };
}

module.exports = middleware;
