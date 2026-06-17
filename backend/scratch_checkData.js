const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const user1 = await prisma.user.findUnique({ where: { email: 'lasya@gmail.com' } });
  const user2 = await prisma.user.findUnique({ where: { email: 'lasya4@gmail.com' } });

  console.log("User1:", user1.id, user1.email);
  console.log("User2:", user2.id, user2.email);

  const followups = await prisma.followUp.findMany({
    include: {
      visit: {
        include: {
          doctor: true,
          user: true
        }
      }
    }
  });

  console.log("\nFollow-ups:");
  followups.forEach(f => {
    console.log(`Followup ID: ${f.id}, NextDate: ${f.nextDate}, Doctor: ${f.visit.doctor.doctorName}, Visit created by User ID: ${f.visit.userId} (${f.visit.user.email}), Doctor managed by User ID: ${f.visit.doctor.managedById}`);
  });
}

check();
