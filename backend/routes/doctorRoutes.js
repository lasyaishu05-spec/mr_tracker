const express = require("express");

const router = express.Router();

const doctorController =
require("../controllers/doctorController");

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["MR", "ADMIN"]),
  doctorController.createDoctor
);

router.get(
  "/",
  authMiddleware,
  doctorController.getAllDoctors
);

router.get(
  "/:id",
  authMiddleware,
  doctorController.getDoctorById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["MR", "ADMIN"]),
  doctorController.updateDoctor
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["MR", "ADMIN"]),
  doctorController.deleteDoctor
);

module.exports = router;