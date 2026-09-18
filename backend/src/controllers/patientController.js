const prisma = require("../config/prisma");

const createPatient = async (req, res) => {
  try {
    const {
      patientCode,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
    } = req.body;

    if (!patientCode || !firstName) {
      return res.status(400).json({
        success: false,
        message: "Patient code and first name are required",
      });
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { patientCode },
    });

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: "Patient code already exists",
      });
    }

    const patient = await prisma.patient.create({
      data: {
        patientCode,
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        phone,
        email,
        address,
        bloodGroup,
      },
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    console.error("Create patient error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error("Get patients error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPatientById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    console.error("Get patient error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
    } = req.body;

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        phone,
        email,
        address,
        bloodGroup,
      },
    });

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Update patient error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    await prisma.patient.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
