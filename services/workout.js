const { generateId } = require('../lib/id');
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

async function getWorkout({ id, userId }) {
  return await prisma.workout.findFirst({ where: { id, userId } });
}

async function createWorkout(workout) {
  return await prisma.workout.create({
    data: {
      ...workout,
      id: await generateId(),
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
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};
