const RateLimit = require('koa2-ratelimit').RateLimit;

// limit each IP to x requests per interval
const ratelimit = RateLimit.middleware({
  interval: { ms: 5000 },
  max: 3,
});

module.exports = ratelimit;
