const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.doctor.findMany({ orderBy: { id: 'desc' }, take: 2 })
  .then(console.log)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
