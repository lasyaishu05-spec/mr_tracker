const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { changePasswordValidation, paginationValidation } = require("../middleware/validationMiddleware");

// All user routes require authentication
router.use(authMiddleware);

router.get("/profile", userController.getProfile);
router.put("/change-password", changePasswordValidation, userController.changePassword);

// Admin only routes
router.get("/", roleMiddleware(["ADMIN"]), paginationValidation, userController.getAllUsers);
router.get("/mr-stats", roleMiddleware(["ADMIN"]), userController.getMRStats);
router.put("/:id/role", roleMiddleware(["ADMIN"]), userController.assignRole);

module.exports = router;
