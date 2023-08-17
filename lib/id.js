const { nanoid, NanoIdSchema } = require('./nanoid');

async function generateId() {
  return await nanoid();
}

module.exports = {
  generateId,
  IdSchema: NanoIdSchema,
};
