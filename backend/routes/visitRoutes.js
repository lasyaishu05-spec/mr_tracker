const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const visitController = require("../controllers/visitController");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all visits
router.get("/", visitController.getAllVisits);

// Get visit by ID
router.get("/:id", visitController.getVisitById);

// Create a new visit
router.post("/", visitController.createVisit);

// Update a visit
router.put("/:id", visitController.updateVisit);

// Delete a visit
router.delete("/:id", visitController.deleteVisit);

module.exports = router;