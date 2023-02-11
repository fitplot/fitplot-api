const prisma = require('../lib/prisma');

async function getWorkoutSet(id) {
  return await prisma.set.findUnique({ where: { id } });
}

async function getSetsForWorkout(workoutId) {
  return await prisma.set.findMany({ where: { workoutId } });
}

async function createSetForWorkout(set) {
  return await prisma.set.create({ data: set });
}

module.exports = {
  getWorkoutSet,
  getSetsForWorkout,
  createSetForWorkout,
};
