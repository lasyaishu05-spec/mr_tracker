const visitService = require('./services/visitService');
const doctorService = require('./services/doctorService');
const prisma = require('./prismaClient');

async function test() {
  const user = await prisma.user.findUnique({ where: { email: 'lasya@gmail.com' } });
  try {
    console.log("Testing visits...");
    const visits = await visitService.getAllVisits(1, 10, "", "", user);
    console.log("Visits fetched successfully:", visits.visits.length);
    
    console.log("Testing doctors...");
    const docs = await doctorService.getAllDoctors(1, 10, "", user);
    console.log("Doctors fetched successfully:", docs.doctors.length);
  } catch (e) {
    console.error("ERROR", e);
  } finally {
    prisma.$disconnect();
  }
}

test();
