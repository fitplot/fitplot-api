const { factory } = require('../lib/nanoid');
const prisma = require('../lib/prisma');

async function getWorkoutsForUser(userId, { take, cursor } = {}) {
  return await prisma.workout.findMany({
    take,
    skip: cursor ? 1 : undefined, // Skip the cursor
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

async function getTotalWorkoutsForUser(userId) {
  return await prisma.workout.count({
    where: {
      userId,
    },
    select: {
      _all: true,
      completedAt: true,
    },
  });
}

async function getWorkout({ id, userId }) {
  return await prisma.workout.findFirst({ where: { id, userId } });
}

async function createWorkout(workout) {
  const nanoid = await factory();

  return await prisma.workout.create({
    data: {
      ...workout,
      id: await nanoid(),
    },
  });
}

async function updateWorkout({ id, userId }, { name, completedAt }) {
  return prisma.workout.update({
    where: {
      id,
      userId,
    },
    data: {
      name,
      completedAt,
    },
  });
}

async function deleteWorkout({ id, userId }) {
  return prisma.workout.delete({
    where: {
      id,
      userId,
    },
  });
}

module.exports = {
  getWorkoutsForUser,
  getTotalWorkoutsForUser,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};
