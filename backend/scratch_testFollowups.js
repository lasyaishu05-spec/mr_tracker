const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const followupService = require('./services/followupService');

async function check() {
  const user2 = await prisma.user.findUnique({ where: { id: 2 } });
  const f1 = await followupService.getAllFollowUps(null, null, user2);
  console.log("Followups for user 2 via service:", f1.length);
  const f2 = await prisma.followUp.findMany({ where: { visit: { userId: 2 } } });
  console.log("Followups for user 2 via raw Prisma:", f2.length);
}

check();
