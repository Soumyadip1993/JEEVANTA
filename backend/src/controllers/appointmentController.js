const prisma = require("../config/prisma");

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, departmentId, appointmentDate, reason } =
      req.body;

    if (!patientId || !doctorId || !departmentId || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message:
          "Patient, doctor, department and appointment date are required",
      });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: Number(patientId) },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: Number(doctorId) },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const department = await prisma.department.findUnique({
      where: { id: Number(departmentId) },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        departmentId: Number(departmentId),
        appointmentDate: new Date(appointmentDate),
        reason,
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        appointmentDate: "asc",
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);

    const { appointmentDate, status, tokenNumber, reason } = req.body;

    const existingAppointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const appointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        ...(appointmentDate && {
          appointmentDate: new Date(appointmentDate),
        }),
        ...(status && {
          status,
        }),
        ...(tokenNumber !== undefined && {
          tokenNumber,
        }),
        ...(reason !== undefined && {
          reason,
        }),
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = Number(req.params.id);

    const existingAppointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!existingAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (existingAppointment.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Completed appointment cannot be cancelled",
      });
    }

    const appointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
};
