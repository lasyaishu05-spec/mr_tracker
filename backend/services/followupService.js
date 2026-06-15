const prisma = require("../prismaClient");

const createFollowUp = async (data) => {

  return prisma.followUp.create({
    data: {
      visitId: Number(data.visitId),
      notes: data.notes?.trim() || "",
      nextDate: new Date(data.nextDate)
    },
    include: {
      visit: {
        include: {
          doctor: true
        }
      }
    }
  });

};

const getAllFollowUps = async (startDate, endDate, user) => {
  const where = user?.role === "ADMIN"
    ? {}
    : {
        visit: {
          userId: Number(user.id)
        }
      };

  if (startDate && endDate) {
    where.nextDate = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }

  return prisma.followUp.findMany({
    where,
    include: {
      visit: {
        include: {
          doctor: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: { nextDate: 'asc' }
  });

};

module.exports = {
  createFollowUp,
  getAllFollowUps
};
