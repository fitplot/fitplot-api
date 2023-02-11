async function getExercise(id) {
  return prisma.exercise.findUnique({
    where: {
      id,
    },
    include: {
      sets: true,
    },
  });
}

async function updateExercise(id, { name }) {
  return prisma.exercise.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
}

module.exports = {
  getExercise,
  updateExercise,
};
