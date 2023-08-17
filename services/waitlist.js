const { generateId } = require('../lib/id');
const prisma = require('../lib/prisma');

async function addToWaitlist(waitlist) {
  return await prisma.waitlist.create({
    data: {
      ...waitlist,
      id: await generateId(),
    },
  });
}

module.exports = {
  addToWaitlist,
};
