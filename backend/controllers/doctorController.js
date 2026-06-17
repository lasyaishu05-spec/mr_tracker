const doctorService =
require("../services/doctorService");

exports.createDoctor = async (req, res) => {

  try {
    // If the user is an MR, automatically assign the doctor to them
    if (req.user && req.user.role === "MR") {
      req.body.managedById = req.user.id;
    }

    const doctor =
      await doctorService.createDoctor(
        req.body
      );

    res.status(201).json({
      success: true,
      data: doctor
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

exports.getAllDoctors = async (req, res) => {

  try {

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 10;

    const search =
      req.query.search || "";

    const result =
      await doctorService.getAllDoctors(
        page,
        limit,
        search,
        req.user
      );

    res.status(200).json({
      success: true,
      totalDoctors: result.totalDoctors,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      data: result.doctors
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.getDoctorById = async (req, res) => {

  try {

    const doctor =
      await doctorService.getDoctorById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      data: doctor
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.updateDoctor = async (req, res) => {

  try {
    // If the user is an MR, ensure they can't reassign the doctor to someone else
    if (req.user && req.user.role === "MR") {
      req.body.managedById = req.user.id;
    }

    const doctor =
      await doctorService.updateDoctor(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      data: doctor
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

exports.deleteDoctor = async (req, res) => {

  try {

    await doctorService.deleteDoctor(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Doctor Deleted Successfully"
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};