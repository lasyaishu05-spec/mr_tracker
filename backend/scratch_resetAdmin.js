const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetAdminPassword() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const admin = await prisma.user.updateMany({
    where: { email: 'admin@gmail.com' },
    data: { password: hashedPassword }
  });

  if (admin.count > 0) {
    console.log("Admin password successfully reset to: Admin@123");
  } else {
    console.log("Admin account not found!");
  }
}

resetAdminPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
