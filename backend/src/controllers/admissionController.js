const prisma = require("../config/prisma");

// Safe User fields — never expose passwordHash
const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

// Common relation structure
const admissionInclude = {
  patient: true,
  doctor: {
    include: {
      user: {
        select: safeUserSelect,
      },
      department: true,
    },
  },
  bed: {
    include: {
      ward: true,
    },
  },
};

// Admit patient and assign a bed
const createAdmission = async (req, res) => {
  try {
    const { patientId, doctorId, bedId } = req.body;

    if (
      patientId === undefined ||
      doctorId === undefined ||
      bedId === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Patient ID, Doctor ID and Bed ID are required",
      });
    }

    const patientIdNumber = Number(patientId);
    const doctorIdNumber = Number(doctorId);
    const bedIdNumber = Number(bedId);

    if (
      !Number.isInteger(patientIdNumber) ||
      !Number.isInteger(doctorIdNumber) ||
      !Number.isInteger(bedIdNumber)
    ) {
      return res.status(400).json({
        success: false,
        message: "Patient ID, Doctor ID and Bed ID must be valid integers",
      });
    }

    // Check patient
    const patient = await prisma.patient.findUnique({
      where: {
        id: patientIdNumber,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Check doctor
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: doctorIdNumber,
      },
      include: {
        user: {
          select: safeUserSelect,
        },
        department: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check bed
    const bed = await prisma.bed.findUnique({
      where: {
        id: bedIdNumber,
      },
      include: {
        ward: true,
      },
    });

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: "Bed not found",
      });
    }

    // Bed must be available
    if (bed.status !== "AVAILABLE") {
      return res.status(409).json({
        success: false,
        message: `Bed is currently ${bed.status.toLowerCase()}`,
      });
    }

    // Patient cannot have two active admissions
    const activeAdmission = await prisma.admission.findFirst({
      where: {
        patientId: patientIdNumber,
        status: "ADMITTED",
      },
    });

    if (activeAdmission) {
      return res.status(409).json({
        success: false,
        message: "Patient already has an active admission",
        admissionId: activeAdmission.id,
      });
    }

    // Create admission + occupy bed atomically
    const admission = await prisma.$transaction(async (tx) => {
      const createdAdmission = await tx.admission.create({
        data: {
          patientId: patientIdNumber,
          doctorId: doctorIdNumber,
          bedId: bedIdNumber,
          status: "ADMITTED",
        },
        include: admissionInclude,
      });

      await tx.bed.update({
        where: {
          id: bedIdNumber,
        },
        data: {
          status: "OCCUPIED",
        },
      });

      return createdAdmission;
    });

    return res.status(201).json({
      success: true,
      message: "Patient admitted and bed assigned successfully",
      admission,
    });
  } catch (error) {
    console.error("Create admission error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all admissions
const getAdmissions = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};

    if (status !== undefined) {
      if (!["ADMITTED", "DISCHARGED"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid admission status",
        });
      }

      where.status = status;
    }

    const admissions = await prisma.admission.findMany({
      where,
      orderBy: {
        admissionDate: "desc",
      },
      include: admissionInclude,
    });

    return res.status(200).json({
      success: true,
      count: admissions.length,
      admissions,
    });
  } catch (error) {
    console.error("Get admissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get admission by ID
const getAdmissionById = async (req, res) => {
  try {
    const admissionId = Number(req.params.id);

    if (!Number.isInteger(admissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID",
      });
    }

    const admission = await prisma.admission.findUnique({
      where: {
        id: admissionId,
      },
      include: admissionInclude,
    });

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    return res.status(200).json({
      success: true,
      admission,
    });
  } catch (error) {
    console.error("Get admission by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get admission history for a patient
const getAdmissionsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

    if (!Number.isInteger(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const admissions = await prisma.admission.findMany({
      where: {
        patientId,
      },
      orderBy: {
        admissionDate: "desc",
      },
      include: admissionInclude,
    });

    return res.status(200).json({
      success: true,
      count: admissions.length,
      patient,
      admissions,
    });
  } catch (error) {
    console.error("Get patient admissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Discharge patient and release bed
const dischargePatient = async (req, res) => {
  try {
    const admissionId = Number(req.params.id);

    if (!Number.isInteger(admissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID",
      });
    }

    const existingAdmission = await prisma.admission.findUnique({
      where: {
        id: admissionId,
      },
      include: {
        bed: true,
      },
    });

    if (!existingAdmission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found",
      });
    }

    if (existingAdmission.status === "DISCHARGED") {
      return res.status(409).json({
        success: false,
        message: "Patient has already been discharged",
      });
    }

    const dischargedAt = new Date();

    // Discharge + release bed atomically
    const admission = await prisma.$transaction(async (tx) => {
      const updatedAdmission = await tx.admission.update({
        where: {
          id: admissionId,
        },
        data: {
          status: "DISCHARGED",
          dischargeDate: dischargedAt,
        },
        include: admissionInclude,
      });

      await tx.bed.update({
        where: {
          id: existingAdmission.bedId,
        },
        data: {
          status: "AVAILABLE",
        },
      });

      return updatedAdmission;
    });

    return res.status(200).json({
      success: true,
      message: "Patient discharged and bed released successfully",
      admission,
    });
  } catch (error) {
    console.error("Discharge patient error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAdmission,
  getAdmissions,
  getAdmissionById,
  getAdmissionsByPatient,
  dischargePatient,
};
