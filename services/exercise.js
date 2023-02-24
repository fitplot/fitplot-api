const prisma = require('../lib/prisma');

async function createExercise(exercise) {
  return await prisma.exercise.create({ data: exercise });
}

async function getExercise(id) {
  return await prisma.exercise.findUnique({
    where: {
      id,
    },
    include: {
      sets: true,
    },
  });
}

async function getExercisesForUser(userId) {
  return await prisma.exercise.findMany({
    where: {
      userId,
    },
  });
}

async function updateExercise({ id, userId, name }) {
  return await prisma.exercise.update({
    where: {
      id,
      userId,
    },
    data: {
      name,
    },
  });
}

module.exports = {
  createExercise,
  getExercise,
  getExercisesForUser,
  updateExercise,
};
