const { factory } = require('../lib/nanoid');
const prisma = require('../lib/prisma');

async function createExercise(exercise) {
  const nanoid = await factory();

  return await prisma.exercise.create({
    data: {
      ...exercise,
      id: await nanoid(),
    },
  });
}

async function getExercise({ id, userId }) {
  return await prisma.exercise.findFirst({
    where: {
      id,
      userId,
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

async function deleteExercise({ id, userId }) {
  return await prisma.exercise.delete({
    where: {
      id,
      userId,
    },
  });
}

module.exports = {
  createExercise,
  deleteExercise,
  getExercise,
  getExercisesForUser,
  updateExercise,
};
