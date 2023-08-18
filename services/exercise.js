const { generateId } = require('../lib/id');
const prisma = require('../lib/prisma');

async function createExercise(exercise) {
  return await prisma.exercise.create({
    data: {
      ...exercise,
      id: await generateId(),
    },
  });
}

async function getExercise({ id, userId }) {
  return await prisma.exercise.findFirst({
    where: {
      id,
      userId,
    },
  });
}

async function getExercisesForUser(userId, { take, cursor, query = '' } = {}) {
  const search =
    query
      .trim()
      .replace('+', '')
      .replace('-', '')
      .replace('*', '')
      .replace('&', '')
      .replace('"', '') + +'*';

  const exercises = await prisma.exercise.findMany({
    take,
    skip: cursor ? 1 : undefined, // Skip the cursor
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      userId,
      name: query ? { search } : undefined,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return exercises;
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
