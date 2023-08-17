const Router = require('@koa/router');

const { getUnits } = require('../services/unit');

const units = new Router();

units.get('/units',  async (ctx) => {
  const units = await getUnits();
  ctx.body = units;
});

module.exports = units;
