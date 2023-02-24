const dayjs = require('dayjs');

const prisma = require('../lib/prisma');
const { SESSION_EXPIRATION_TIME } = require('../lib/session');

async function getUserForSession(id) {
  const session = await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  });

  return session.user;
}

async function createSession({ userId }) {
  return prisma.session.create({
    data: {
      userId,
      expiresAt: dayjs().add(SESSION_EXPIRATION_TIME).toISOString(),
    },
  });
}

async function deleteSession(id) {
  return await prisma.session.delete({ where: { id } });
}

module.exports = {
  getUserForSession,
  createSession,
  deleteSession,
};
