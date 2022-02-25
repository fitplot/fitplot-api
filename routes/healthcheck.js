const Router = require('koa-joi-router');

const router = Router();

router.get('/ping', async (ctx) => {
  try {
    ctx.body = {
      status: 'success',
      data: 'Test Server',
    };
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
