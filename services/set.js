const { factory } = require('../lib/nanoid');
const prisma = require('../lib/prisma');

async function createManySets(sets) {
  const nanoid = await factory();

  for (set of sets) {
    set.id = await nanoid();
  }

  return await prisma.set.createMany({ data: sets });
}

async function getPreviousSetsForExercise({ exerciseId, userId }, workoutId) {
  const mostRecentSetForExercise = await prisma.set.findFirst({
    where: { exerciseId, userId, NOT: { workoutId } },
    orderBy: { createdAt: 'asc' },
  });

  if (!mostRecentSetForExercise) return;

  return await prisma.set.findMany({
    where: { exerciseId, workoutId: mostRecentSetForExercise.workoutId },
  });
}

async function getSetsForWorkout({ workoutId, userId }) {
  return await prisma.set.findMany({ where: { workoutId, userId } });
}

async function updateSet({ id, userId }, { amount, volume, unit }) {
  return await prisma.set.update({
    where: { id, userId },
    data: { amount, volume, unit },
  });
}

async function updateManySets({ userId, fromExerciseId, toExerciseId }) {
  return await prisma.set.updateMany({
    where: {
      userId,
      exerciseId: fromExerciseId,
    },
    data: {
      exerciseId: toExerciseId,
    },
  });
}

async function deleteSet({ id, userId }) {
  return await prisma.set.delete({
    where: { id, userId },
  });
}

module.exports = {
  createManySets,
  getPreviousSetsForExercise,
  getSetsForWorkout,
  updateSet,
  updateManySets,
  deleteSet,
};
