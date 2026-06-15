const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const dashboardController = require("../controllers/dashboardController");

/* Admin Dashboard */
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  dashboardController.getAdminDashboard
);

/* MR Dashboard */
router.get(
  "/mr",
  authMiddleware,
  roleMiddleware(["MR"]),
  dashboardController.getMRDashboard
);

module.exports = router;