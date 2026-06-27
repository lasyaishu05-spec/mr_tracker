const prisma = require("../prismaClient");
const bcrypt = require("bcryptjs");

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  if (!user) throw new Error("User not found");
  return user;
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const masterPin = process.env.MASTER_PIN || "123456";

  if (oldPassword !== masterPin) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Incorrect old password or PIN");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
  return true;
};

const createUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });
  if (existingUser) throw new Error("User with this email already exists");

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "MR"
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  return user;
};


const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count()
  ]);
  
  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  };
};

const assignRole = async (userId, newRole) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: { id: true, name: true, email: true, role: true }
  });
  return user;
};

const getMRStats = async () => {
  const users = await prisma.user.findMany({
    where: { role: 'MR' },
    select: {
      id: true,
      name: true,
      email: true,
      managedDoctors: {
        select: {
          visits: {
            select: {
              id: true,
              followups: { select: { id: true } }
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  return users.map(user => {
    let totalVisits = 0;
    let totalFollowups = 0;
    
    user.managedDoctors.forEach(doc => {
      totalVisits += doc.visits.length;
      doc.visits.forEach(v => {
        totalFollowups += v.followups.length;
      });
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      totalVisits,
      totalFollowups
    };
  });
};

const getPasswords = async () => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, password: true }
  });
  return users;
};

module.exports = {
  getProfile,
  changePassword,
  getAllUsers,
  assignRole,
  getMRStats,
  getPasswords,
  createUser
};
