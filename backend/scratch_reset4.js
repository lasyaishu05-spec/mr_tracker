const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function reset() {
  const hash = await bcrypt.hash('lasya12', 10);
  await prisma.user.update({
    where: { email: 'lasya4@gmail.com' },
    data: { password: hash }
  });
  console.log("Password reset successfully for lasya4@gmail.com to 'lasya12'");
}

reset();
