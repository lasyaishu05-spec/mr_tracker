const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Populating mock data...");

  // Create Medical Representatives (MRs)
  const mrPassword = await bcrypt.hash("Password123", 10);
  
  const mr1 = await prisma.user.upsert({
    where: { email: "john.doe@gmail.com" },
    update: {},
    create: { name: "John Doe", email: "john.doe@gmail.com", password: mrPassword, role: "MR" }
  });

  const mr2 = await prisma.user.upsert({
    where: { email: "sarah.smith@gmail.com" },
    update: {},
    create: { name: "Sarah Smith", email: "sarah.smith@gmail.com", password: mrPassword, role: "MR" }
  });

  console.log("Created MRs");

  // Create Doctors
  const doctorsData = [
    { doctorName: "Dr. Gregory House", hospitalName: "Princeton-Plainsboro", specialization: "Diagnostic Medicine", managedById: mr1.id },
    { doctorName: "Dr. Stephen Strange", hospitalName: "Metro-General Hospital", specialization: "Neurosurgery", managedById: mr1.id },
    { doctorName: "Dr. Meredith Grey", hospitalName: "Grey Sloan Memorial", specialization: "General Surgery", managedById: mr2.id },
    { doctorName: "Dr. John Watson", hospitalName: "St. Bart's Hospital", specialization: "General Practice", managedById: mr2.id },
    { doctorName: "Dr. Shaun Murphy", hospitalName: "St. Bonaventure", specialization: "Surgery", managedById: mr1.id }
  ];

  const doctors = [];
  for (const data of doctorsData) {
    const doc = await prisma.doctor.create({ data });
    doctors.push(doc);
  }
  console.log("Created Doctors");

  // Create Visits and FollowUps
  const pastDate1 = new Date(); pastDate1.setDate(pastDate1.getDate() - 5);
  const pastDate2 = new Date(); pastDate2.setDate(pastDate2.getDate() - 2);
  const futureDate1 = new Date(); futureDate1.setDate(futureDate1.getDate() + 3);
  const futureDate2 = new Date(); futureDate2.setDate(futureDate2.getDate() + 7);

  const visitsData = [
    {
      userId: mr1.id, doctorId: doctors[0].id, visitDate: pastDate1,
      productsDiscussed: "Vicodin, Amoxicillin", samplesGiven: 15, feedback: "Doctor seemed interested but busy.", status: "INTERESTED"
    },
    {
      userId: mr1.id, doctorId: doctors[1].id, visitDate: pastDate2,
      productsDiscussed: "Neuro-blockers", samplesGiven: 5, feedback: "Requested more clinical trial data.", status: "PENDING"
    },
    {
      userId: mr2.id, doctorId: doctors[2].id, visitDate: pastDate1,
      productsDiscussed: "Surgical tools, Anesthetics", samplesGiven: 20, feedback: "Very positive response. Needs a follow-up next week.", status: "INTERESTED"
    },
    {
      userId: mr2.id, doctorId: doctors[3].id, visitDate: new Date(),
      productsDiscussed: "Basic antibiotics", samplesGiven: 50, feedback: "Routine drop-off. Not interested in new products.", status: "NOT_INTERESTED"
    },
    {
      userId: mr1.id, doctorId: doctors[4].id, visitDate: pastDate2,
      productsDiscussed: "Pediatric painkillers", samplesGiven: 10, feedback: "Successful pitch.", status: "COMPLETED"
    }
  ];

  const visits = [];
  for (const data of visitsData) {
    const visit = await prisma.visit.create({ data });
    visits.push(visit);
  }
  console.log("Created Visits");

  // Create Follow-ups
  await prisma.followUp.create({
    data: { visitId: visits[0].id, notes: "Follow up with more Vicodin samples.", nextDate: futureDate1, status: "PENDING" }
  });
  await prisma.followUp.create({
    data: { visitId: visits[1].id, notes: "Provide requested clinical trial data.", nextDate: futureDate2, status: "PENDING" }
  });
  await prisma.followUp.create({
    data: { visitId: visits[2].id, notes: "Bring detailed pricing sheet.", nextDate: futureDate1, status: "PENDING" }
  });
  console.log("Created FollowUps");

  console.log("✅ Successfully populated database with mock data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
