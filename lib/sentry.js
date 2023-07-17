const Sentry = require('@sentry/node');

const client = require('./prisma');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new Sentry.Integrations.Prisma({ client })],
});

function sentry(app) {
  app.on('error', (error, ctx) => {
    console.error(error);

    Sentry.withScope(function (scope) {
      scope.addEventProcessor(function (event) {
        return Sentry.addRequestDataToEvent(event, ctx.request);
      });
      Sentry.captureException(error);
    });
  });
}

module.exports = {
  sentry,
};
