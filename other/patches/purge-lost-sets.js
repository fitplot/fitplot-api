const prisma = require('../../lib/prisma');

const go = async () => {
  const query = {
    where: { workout: null, OR: { exercise: null } },
  };

  await prisma.set.deleteMany(query);
};

await go();
