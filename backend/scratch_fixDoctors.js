const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixDoctors() {
  const john = await prisma.user.findUnique({ where: { email: 'john.doe@gmail.com' } });
  if (john) {
    await prisma.doctor.updateMany({
      where: { managedById: null },
      data: { managedById: john.id }
    });
    console.log("Fixed unassigned doctors, assigned to John Doe.");
  }
}

fixDoctors()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
