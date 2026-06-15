const express = require("express");

const router = express.Router();

const followupController =
require("../controllers/followupController");

const authMiddleware =
require("../middleware/authMiddleware");

router.post(
  "/",
  authMiddleware,
  followupController.createFollowUp
);

router.get(
  "/",
  authMiddleware,
  followupController.getAllFollowUps
);

module.exports = router;