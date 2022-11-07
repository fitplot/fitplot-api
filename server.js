const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const logger = require('koa-logger');

const config = require('./config');
const routes = require('./routes');

const PORT = config.port;

const app = new Koa();

app.use(bodyParser());
app.use(
  cors({
    origin: '*',
  })
);
app.use(logger());

app.use(routes.middleware());

app.listen(PORT, async () => {
  console.log(`Server listening on port: ${PORT}`);
});

app.on('error', (err) => {
  console.error(err);
});

module.exports = app;
