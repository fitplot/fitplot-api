const prisma = require('../lib/prisma');

async function getWorkoutsForUser(userId, { take, orderBy } = {}) {
  return await prisma.workout.findMany({
    take,
    where: {
      userId,
    },
    orderBy,
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
  return await prisma.workout.findUnique({ where: { id, userId } });
}

async function createWorkout(workout) {
  return await prisma.workout.create({ data: workout });
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

async function deleteWorkout(id) {
  return prisma.workout.delete({
    where: {
      id,
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
