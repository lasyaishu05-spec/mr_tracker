const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@gmail.com" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("Created Admin User:", adminUser.email);
  } else {
    console.log("Admin already exists!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
