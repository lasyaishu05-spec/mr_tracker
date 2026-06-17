const express = require("express");

const router = express.Router();

const followupController =
require("../controllers/followupController");

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["MR", "ADMIN"]),
  followupController.createFollowUp
);

router.get(
  "/",
  authMiddleware,
  followupController.getAllFollowUps
);

module.exports = router;