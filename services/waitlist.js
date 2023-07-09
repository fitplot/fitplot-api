const prisma = require('../lib/prisma');

async function addToWaitlist(data) {
  return await prisma.waitlist.create({ data });
}

module.exports = {
  addToWaitlist,
};
