const prisma = require('../lib/prisma');

async function createManySets(sets) {
  return await prisma.set.createMany({ data: sets });
}

async function getSet(id) {
  return await prisma.set.findUnique({ where: { id } });
}

async function getPreviousSetsForExercise(exerciseId, workoutId) {
  const mostRecentSetForExercise = await prisma.set.findFirst({
    where: { exerciseId, NOT: { workoutId } },
    orderBy: { createdAt: 'asc' },
  });

  if (!mostRecentSetForExercise) return null;

  return await prisma.set.findMany({
    where: { exerciseId, workoutId: mostRecentSetForExercise.workoutId },
  });
}

async function getSetsForWorkout(workoutId) {
  return await prisma.set.findMany({ where: { workoutId } });
}

async function updateSet(id, { amount, volume, unit }) {
  return await prisma.set.update({
    where: { id },
    data: { amount, volume, unit },
  });
}

async function deleteSet(id) {
  return await prisma.set.delete({
    where: { id },
  });
}

module.exports = {
  createManySets,
  getPreviousSetsForExercise,
  getSet,
  getSetsForWorkout,
  updateSet,
  deleteSet,
};
