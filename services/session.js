const dayjs = require('dayjs');

const { factory } = require('../lib/nanoid');
const prisma = require('../lib/prisma');
const { SESSION_EXPIRATION_TIME } = require('../lib/session');

async function getUserForSession(id) {
  const session = await prisma.session.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!session) return null;

  return session.user;
}

async function createSession({ userId }) {
  const nanoid = await factory();

  return prisma.session.create({
    data: {
      id: await nanoid(),
      userId,
      expiresAt: dayjs().add(SESSION_EXPIRATION_TIME).toISOString(),
    },
  });
}

async function deleteSession(id) {
  try {
    await prisma.session.delete({ where: { id } });
  } catch (error) {
    // Record to delete does not exist.
    if (error.code === 'P2025') return;

    throw error;
  }
}

module.exports = {
  getUserForSession,
  createSession,
  deleteSession,
};
