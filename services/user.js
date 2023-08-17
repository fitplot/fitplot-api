const { generateId } = require('../lib/id');
const prisma = require('../lib/prisma');

async function createUser(user) {
  return prisma.user.create({
    data: {
      ...user,
      id: await generateId(),
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
