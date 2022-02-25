const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const logger = require('koa-logger');
const config = require('./config');

const PORT = config.port;

const healthcheckRoutes = require('./routes/healthcheck');

const app = new Koa();

app.use(bodyParser());
app.use(
  cors({
    origin: '*',
  })
);
app.use(logger());

app.use(healthcheckRoutes.middleware());

module.exports = app
  .listen(PORT, async () => {
    console.log(`Server listening on port: ${PORT}`);
  })
  .on('error', (err) => {
    console.error(err);
  });
