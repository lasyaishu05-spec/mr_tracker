const prisma = require("../prismaClient");

const normalizeVisitData = (data, userId) => {
const doctorId = Number(data.doctorId);
const visitDate = new Date(data.visitDate);
const samplesGiven = Number(data.samplesGiven || 0);

if (!doctorId) {
throw new Error("Doctor is required");
}

if (Number.isNaN(visitDate.getTime())) {
throw new Error("Visit date is required");
}

if (Number.isNaN(samplesGiven) || samplesGiven < 0) {
throw new Error("Samples given must be 0 or more");
}

return {
userId: Number(userId),
doctorId,
visitDate,
productsDiscussed: data.productsDiscussed?.trim() || null,
samplesGiven,
feedback: data.feedback?.trim() || null,
status: data.status || "PENDING"
};
};

const getAllVisits = async (
page = 1,
limit = 10,
status = "",
doctorId = ""
) => {

const skip = (page - 1) * limit;

const where = {};

if (status) {
where.status = status;
}

if (doctorId) {
where.doctorId = Number(doctorId);
}

const totalVisits =
await prisma.visit.count({
where
});

const visits =
await prisma.visit.findMany({
where,
skip,
take: limit,
orderBy: {
id: "asc"
},
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
});

return {
visits,
totalVisits,
totalPages: Math.ceil(
totalVisits / limit
),
currentPage: page
};
};

const getVisitById = async (id) => {
return prisma.visit.findUnique({
where: {
id: Number(id)
},
include: {
doctor: true,
user: true,
followups: true
}
});
};

const createVisit = async (data, userId) => {
return prisma.visit.create({
data: normalizeVisitData(data, userId),
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
});
};

const updateVisit = async (id, data) => {
return prisma.visit.update({
where: {
id: Number(id)
},
data
});
};

const deleteVisit = async (id) => {
return prisma.visit.delete({
where: {
id: Number(id)
}
});
};

module.exports = {
getAllVisits,
getVisitById,
createVisit,
updateVisit,
deleteVisit
};
