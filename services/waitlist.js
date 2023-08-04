const { factory } = require('../lib/nanoid');
const prisma = require('../lib/prisma');

async function addToWaitlist(waitlist) {
  const nanoid = await factory();

  return await prisma.waitlist.create({
    data: {
      ...waitlist,
      id: await nanoid(),
    },
  });
}

module.exports = {
  addToWaitlist,
};
