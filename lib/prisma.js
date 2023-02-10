const { PrismaClient } = require('@prisma/client');

// create prisma client
const prisma = new PrismaClient();

// connect to client
prisma.$connect();

module.exports = prisma;
