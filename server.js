const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const logger = require('koa-logger');

const routes = require('./routes');

const ENV = require('./lib/env');
const { sentry } = require('./lib/sentry');
const session = require('./lib/session');

const PORT = ENV.PORT;

const app = new Koa();

app.keys = [process.env.SIGNED_COOKIE_SECRET];

app.use(session(app));

app.use(
  bodyParser({
    onerror: function (error, ctx) {
      ctx.throw(422, 'body parse error');
    },
  }),
);

app.use(
  cors({
    origin: '*',
  }),
);

app.use(logger());

app.use(routes.middleware());
app.use(routes.allowedMethods());

sentry(app);

app.listen(PORT, async () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
