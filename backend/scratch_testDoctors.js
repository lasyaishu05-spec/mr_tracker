const doctorService = require('./services/doctorService');
const prisma = require('./prismaClient');

async function test() {
  const user = await prisma.user.findUnique({ where: { email: 'lasya@gmail.com' } });
  try {
    const res = await doctorService.getAllDoctors(1, 10, "", user);
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("ERROR", e);
  } finally {
    prisma.$disconnect();
  }
}

test();
