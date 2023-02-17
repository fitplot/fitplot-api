const prisma = require('../lib/prisma');

async function createManySets(sets) {
  return await prisma.set.createMany({ data: sets });
}

async function getSet(id) {
  return await prisma.set.findUnique({ where: { id } });
}

async function getSetsForWorkout(workoutId) {
  return await prisma.set.findMany({ where: { workoutId } });
}

module.exports = {
  createManySets,
  getSet,
  getSetsForWorkout,
};
