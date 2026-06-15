const dashboardService = require("../services/dashboardService");

/* Admin Dashboard */
exports.getAdminDashboard = async (req, res) => {
  try {
    console.log("===== ADMIN DASHBOARD START =====");

    const dashboardData =
      await dashboardService.getAdminDashboard();

    console.log("Dashboard Data:", dashboardData);

    res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {

    console.error("ADMIN DASHBOARD ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });

  }
};

/* MR Dashboard */
exports.getMRDashboard = async (req, res) => {
  try {

    const userId = req.user.id;

    const dashboardData =
      await dashboardService.getMRDashboard(userId);

    res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });

  }
};