const prisma = require("../prismaClient");

const normalizeStatusCounts = (visitsByStatus) =>
  visitsByStatus.map((item) => ({
    status: item.status,
    count: item._count.status,
  }));

const countStatus = (visitsByStatus, status) =>
  visitsByStatus.find((item) => item.status === status)?.count || 0;

const countUniqueDoctorsByVisitStatus = async (status, where = {}) => {
  const doctors = await prisma.visit.groupBy({
    by: ["doctorId"],
    where: {
      ...where,
      status,
    },
  });

  return doctors.length;
};

/* =========================
   ADMIN DASHBOARD
========================= */

const getAdminDashboard = async () => {
  const [
    totalVisits,
    totalDoctors,
    totalUsers,
    totalMRs,
    rawVisitsByStatus,
    recentVisits,
    totalFollowups,
    pendingFollowups,
    upcomingFollowups,
    interestedDoctors,
  ] = await Promise.all([
    prisma.visit.count(),
    prisma.doctor.count(),
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: "MR",
      },
    }),
    prisma.visit.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
    prisma.visit.findMany({
      take: 5,
      orderBy: {
        visitDate: "desc",
      },
      include: {
        doctor: {
          include: {
            managedBy: true
          }
        },
        user: true,
      },
    }),
    prisma.followUp.count(),
    prisma.followUp.count({
      where: {
        status: "PENDING",
      },
    }),
    prisma.followUp.findMany({
      where: {
        nextDate: {
          gte: new Date(),
        },
      },
      include: {
        visit: {
          include: {
            doctor: {
              include: {
                managedBy: true
              }
            },
            user: true,
          },
        },
      },
      take: 5,
      orderBy: {
        nextDate: "asc",
      },
    }),
    countUniqueDoctorsByVisitStatus("INTERESTED"),
  ]);

  const visitsByStatus = normalizeStatusCounts(rawVisitsByStatus);

  return {
    totalVisits,
    totalDoctors,
    totalUsers,
    totalMRs,
    completedVisits: countStatus(visitsByStatus, "COMPLETED"),
    pendingVisits: countStatus(visitsByStatus, "PENDING"),
    interestedDoctors,
    totalFollowups,
    pendingFollowups,
    visitsByStatus,
    recentVisits,
    upcomingFollowups,
  };
};

/* =========================
   MR DASHBOARD
========================= */

const getMRDashboard = async (userId) => {
  const visitWhere = { userId };
  const followupWhere = {
    visit: {
      userId,
    },
  };

  const [
    totalVisits,
    totalDoctors,
    rawVisitsByStatus,
    recentVisits,
    totalFollowups,
    pendingFollowups,
    upcomingFollowups,
    interestedDoctors,
  ] = await Promise.all([
    prisma.visit.count({
      where: visitWhere,
    }),
    prisma.doctor.count(),
    prisma.visit.groupBy({
      by: ["status"],
      where: visitWhere,
      _count: {
        status: true,
      },
    }),
    prisma.visit.findMany({
      where: visitWhere,
      take: 5,
      orderBy: {
        visitDate: "desc",
      },
      include: {
        doctor: {
          include: {
            managedBy: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.followUp.count({
      where: followupWhere,
    }),
    prisma.followUp.count({
      where: {
        ...followupWhere,
        status: "PENDING",
      },
    }),
    prisma.followUp.findMany({
      where: {
        ...followupWhere,
        nextDate: {
          gte: new Date(),
        },
      },
      include: {
        visit: {
          include: {
            doctor: {
              include: {
                managedBy: true
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      take: 5,
      orderBy: {
        nextDate: "asc",
      },
    }),
    countUniqueDoctorsByVisitStatus("INTERESTED", visitWhere),
  ]);

  const visitsByStatus = normalizeStatusCounts(rawVisitsByStatus);

  return {
    totalVisits,
    totalDoctors,
    completedVisits: countStatus(visitsByStatus, "COMPLETED"),
    pendingVisits: countStatus(visitsByStatus, "PENDING"),
    interestedDoctors,
    totalFollowups,
    pendingFollowups,
    visitsByStatus,
    recentVisits,
    upcomingFollowups,
  };
};

module.exports = {
  getAdminDashboard,
  getMRDashboard,
};
