const prisma = require('../lib/prisma');

async function getUnits() {
  return await prisma.amountUnit.findMany();
}

module.exports = {
  getUnits,
};
