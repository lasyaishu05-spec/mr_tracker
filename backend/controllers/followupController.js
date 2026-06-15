const followupService =
require("../services/followupService");

exports.createFollowUp = async (req, res) => {

  try {

    const followup =
      await followupService.createFollowUp(
        req.body
      );

    res.status(201).json({
      success: true,
      data: followup
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

exports.getAllFollowUps = async (req, res) => {

  try {

    const { startDate, endDate } = req.query;
    const followups =
      await followupService.getAllFollowUps(startDate, endDate, req.user);

    res.status(200).json({
      success: true,
      data: followups
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
