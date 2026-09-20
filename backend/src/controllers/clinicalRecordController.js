const prisma = require("../config/prisma");

const createClinicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      symptoms,
      diagnosis,
      notes,
    } = req.body;

    if (!patientId || !doctorId) {
      return res.status(400).json({
        success: false,
        message: "Patient and doctor are required",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: {
        id: Number(patientId),
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: {
        id: Number(doctorId),
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: {
          id: Number(appointmentId),
        },
      });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }
    }

    const clinicalRecord = await prisma.clinicalRecord.create({
      data: {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        appointmentId: appointmentId
          ? Number(appointmentId)
          : null,
        symptoms,
        diagnosis,
        notes,
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Clinical record created successfully",
      clinicalRecord,
    });
  } catch (error) {
    console.error("Create clinical record error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getClinicalRecords = async (req, res) => {
  try {
    const records = await prisma.clinicalRecord.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: records.length,
      clinicalRecords: records,
    });
  } catch (error) {
    console.error("Get clinical records error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getClinicalRecordById = async (req, res) => {
  try {
    const recordId = Number(req.params.id);

    const clinicalRecord = await prisma.clinicalRecord.findUnique({
      where: {
        id: recordId,
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true,
        prescriptions: true,
        labTests: true,
      },
    });

    if (!clinicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Clinical record not found",
      });
    }

    return res.status(200).json({
      success: true,
      clinicalRecord,
    });
  } catch (error) {
    console.error("Get clinical record error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateClinicalRecord = async (req, res) => {
  try {
    const recordId = Number(req.params.id);

    const {
      symptoms,
      diagnosis,
      notes,
    } = req.body;

    const existingRecord = await prisma.clinicalRecord.findUnique({
      where: {
        id: recordId,
      },
    });

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "Clinical record not found",
      });
    }

    const clinicalRecord = await prisma.clinicalRecord.update({
      where: {
        id: recordId,
      },
      data: {
        ...(symptoms !== undefined && { symptoms }),
        ...(diagnosis !== undefined && { diagnosis }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Clinical record updated successfully",
      clinicalRecord,
    });
  } catch (error) {
    console.error("Update clinical record error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createClinicalRecord,
  getClinicalRecords,
  getClinicalRecordById,
  updateClinicalRecord,
};
