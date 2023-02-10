const prisma = require('../lib/prisma');

async function getWorkoutsForUser(userId) {
  return await prisma.workout.findMany({
    where: {
      userId,
    },
  });
}

async function getWorkout(id) {
  return await prisma.workout.findUnique({ where: { id } });
}

module.exports = {
  getWorkoutsForUser,
  getWorkout,
};
