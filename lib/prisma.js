const { PrismaClient } = require('@prisma/client');

// Keeping a global instance of the prisma client prevents us from making
// multiple connections to the db when node's `require` cache is cleared.

/**
 * @type {PrismaClient}
 */
const prisma = global._prisma || (global._prisma = init());

function init() {
  // create prisma client
  const client = new PrismaClient();

  // make the connection eagerly so the first request doesn't have to wait
  client.$connect();

  return client;
}

module.exports = prisma;
