const visitService = require("../services/visitService");

exports.getAllVisits = async (req, res) => {

  try {

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 10;

    const status =
      req.query.status || "";

    const doctorId =
      req.query.doctorId || "";

    const result =
      await visitService.getAllVisits(
        page,
        limit,
        status,
        doctorId
      );

    res.status(200).json({
      success: true,
      totalVisits: result.totalVisits,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      data: result.visits
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.getVisitById = async (req, res) => {

  try {

    const visit =
      await visitService.getVisitById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: visit
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.createVisit = async (req, res) => {

  try {

    const visit =
      await visitService.createVisit(
        req.body,
        req.user.id
      );

    res.status(201).json({
      success: true,
      data: visit
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.updateVisit = async (req, res) => {

  try {

    const visit =
      await visitService.updateVisit(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: visit
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.deleteVisit = async (req, res) => {

  try {

    await visitService.deleteVisit(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
