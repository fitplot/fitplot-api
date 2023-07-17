const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const logger = require('koa-logger');

require('dotenv').config();

const config = require('./config');
const routes = require('./routes');

const session = require('./lib/session');

const PORT = config.port;

const app = new Koa();

app.keys = [process.env.SIGNED_COOKIE_SECRET];

app.use(session(app));

app.use(
  bodyParser({
    onerror: function (error, ctx) {
      ctx.throw(422, 'body parse error');
    },
  })
);

app.use(
  cors({
    origin: '*',
  })
);

app.use(logger());

app.use(routes.middleware());
app.use(routes.allowedMethods());

app.listen(PORT, async () => {
  console.log(`Server listening on port: ${PORT}`);
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

app.on('error', (error, ctx) => {
  console.error(error);

  Sentry.withScope(function (scope) {
    scope.addEventProcessor(function (event) {
      return Sentry.addRequestDataToEvent(event, ctx.request);
    });
    Sentry.captureException(error);
  });
});

module.exports = app;
