const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash('123456', 10);
  await prisma.user.update({
    where: { email: 'admin@gmail.com' },
    data: { password: hash }
  });
  console.log('UPDATED PASSWORD');
}
main().catch(console.error).finally(() => prisma.$disconnect());
