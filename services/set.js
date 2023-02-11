const prisma = require('../lib/prisma');

async function createSet(set) {
  return await prisma.set.create({ data: set });
}

async function getSet(id) {
  return await prisma.set.findUnique({ where: { id } });
}

async function getSetsForWorkout(workoutId) {
  return await prisma.set.findMany({ where: { workoutId } });
}

module.exports = {
  createSet,
  getSet,
  getSetsForWorkout,
};
