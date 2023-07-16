const prisma = require('../../lib/prisma');

const go = async () => {
  const query = {
    where: { userId: '789' },
    data: { userId: '63f86a874dc302cf973107ee' },
  };

  await prisma.workout.updateMany(query);
  await prisma.set.updateMany(query);
  await prisma.exercise.updateMany(query);
};

await go();
