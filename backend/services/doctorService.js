const prisma = require("../prismaClient");

const normalizeDoctorData = (data) => {
const doctorName = data.doctorName?.trim();
const hospitalName = data.hospitalName?.trim();
const specialization = data.specialization?.trim() || null;
const managedById = data.managedById ? Number(data.managedById) : null;

if (!doctorName) {
throw new Error("Doctor name is required");
}

if (!hospitalName) {
throw new Error("Hospital name is required");
}

  return {
    doctorName,
    hospitalName,
    specialization,
    managedById
  };
};

const mapDoctorWithMrOwner = (doctor) => {
  const latestVisit = doctor.visits?.[0] || null;

  return {
    ...doctor,
    visits: undefined,
    latestVisit,
    mrOwner: doctor.managedBy || latestVisit?.user || null
  };
};

const createDoctor = async (data) => {
return prisma.doctor.create({
data: normalizeDoctorData(data)
});
};

const getAllDoctors = async (
page = 1,
limit = 10,
search = ""
) => {

const skip = (page - 1) * limit;

const where = search
? {
OR: [
{
doctorName: {
contains: search
}
},
{
hospitalName: {
contains: search
}
},
{
specialization: {
contains: search
}
},
{
visits: {
some: {
user: {
name: {
contains: search
}
}
}
}
}
]
}
: {};

const totalDoctors =
await prisma.doctor.count({
where
});

const doctors =
await prisma.doctor.findMany({
where,
skip,
take: limit,
orderBy: {
id: "asc"
},
include: {
visits: {
take: 1,
orderBy: {
visitDate: "desc"
},
include: {
user: {
select: {
id: true,
name: true,
email: true
}
}
}
},
managedBy: {
select: {
id: true,
name: true,
email: true
}
}
}
});

return {
doctors: doctors.map(mapDoctorWithMrOwner),
totalDoctors,
totalPages: Math.ceil(
totalDoctors / limit
),
currentPage: page
};
};

const getDoctorById = async (id) => {
const doctor = await prisma.doctor.findUnique({
where: {
id: Number(id)
},
include: {
visits: {
take: 1,
orderBy: {
visitDate: "desc"
},
include: {
user: {
select: {
id: true,
name: true,
email: true
}
}
}
},
managedBy: {
select: {
id: true,
name: true,
email: true
}
}
}
});

return doctor ? mapDoctorWithMrOwner(doctor) : null;
};

const updateDoctor = async (id, data) => {
return prisma.doctor.update({
where: {
id: Number(id)
},
data: normalizeDoctorData(data)
});
};

const deleteDoctor = async (id) => {
const doctorId = Number(id);

const doctor = await prisma.doctor.findUnique({
where: {
id: doctorId
}
});

if (!doctor) {
throw new Error("Doctor not found");
}

return prisma.$transaction(async (tx) => {
const visits = await tx.visit.findMany({
where: {
doctorId
},
select: {
id: true
}
});

const visitIds = visits.map((visit) => visit.id);

if (visitIds.length > 0) {
await tx.followUp.deleteMany({
where: {
visitId: {
in: visitIds
}
}
});

await tx.visit.deleteMany({
where: {
doctorId
}
});
}

return tx.doctor.delete({
where: {
id: doctorId
}
});
});
};

module.exports = {
createDoctor,
getAllDoctors,
getDoctorById,
updateDoctor,
deleteDoctor
};
