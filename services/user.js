const { factory } = require('../lib/nanoid');
const prisma = require('../lib/prisma');

async function createUser(user) {
  const nanoid = await factory();

  return prisma.user.create({
    data: {
      ...user,
      id: await nanoid(),
    },
  });
}

async function getUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

module.exports = {
  createUser,
  getUserByEmail,
};
