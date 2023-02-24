const prisma = require('../lib/prisma');

async function createUser(data) {
  return prisma.user.create({ data });
}

async function getUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

module.exports = {
  createUser,
  getUserByEmail,
};
