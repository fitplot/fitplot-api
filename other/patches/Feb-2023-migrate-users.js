const prisma = require('../../lib/prisma');

const go = async () => {
  const query = {
    where: { userId: '456' },
    data: { userId: '63f6e2b2c5bc7494546512a8' },
  };

  await prisma.workout.updateMany(query);
  await prisma.set.updateMany(query);
  await prisma.exercise.updateMany(query);
};

go();
