
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const prisma = require("./prismaClient");

const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const visitRoutes = require("./routes/visitRoutes");
const followupRoutes = require("./routes/followupRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const { swaggerUi, specs } = require("./utils/swagger");

const app = express();

/* =========================
Middleware
========================= */
app.set("trust proxy", 1);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());

/* =========================
API Routes
========================= */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes" }
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/followups", followupRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/* =========================
Home Route
========================= */
app.get("/", (req, res) => {
res.status(200).json({
success: true,
message: "MR Tracker API Running"
});
});

/* =========================
Test Users
========================= */

/* =========================
Test Doctors
========================= */
app.get("/test-doctors", async (req, res) => {
try {
const doctors = await prisma.doctor.findMany();

res.status(200).json({
  success: true,
  count: doctors.length,
  data: doctors
});

} catch (error) {
res.status(500).json({
success: false,
message: error.message
});
}
});

/* =========================
Test Visits
========================= */
app.get("/test-db", async (req, res) => {
try {
const visits = await prisma.visit.findMany({
include: {
user: {
select: {
id: true,
name: true,
email: true
}
},
doctor: true,
followups: true
}
});

res.status(200).json({
  success: true,
  count: visits.length,
  data: visits
});

} catch (error) {
res.status(500).json({
success: false,
message: error.message
});
}
});

/* =========================
Test FollowUps
========================= */
app.get("/test-followups", async (req, res) => {
try {
const followups = await prisma.followUp.findMany({
include: {
visit: {
include: {
doctor: true,
user: {
select: {
id: true,
name: true
}
}
}
}
}
});

res.status(200).json({
  success: true,
  count: followups.length,
  data: followups
});

} catch (error) {
res.status(500).json({
success: false,
message: error.message
});
}
});


/* =========================
   Test Users
========================= */
app.get("/test-users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

/* =========================
404 Handler
========================= */
app.use((req, res) => {
res.status(404).json({
success: false,
message: "Route Not Found"
});
});

/* =========================
Start Server
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`🚀 Server Running on Port ${PORT}`);
});
