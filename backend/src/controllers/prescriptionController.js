const prisma = require("../config/prisma");

const createPrescription = async (req, res) => {
  try {
    const {
      clinicalRecordId,
      notes,
      items,
    } = req.body;

    if (!clinicalRecordId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Clinical record and at least one medicine are required",
      });
    }

    const clinicalRecord = await prisma.clinicalRecord.findUnique({
      where: {
        id: Number(clinicalRecordId),
      },
    });

    if (!clinicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Clinical record not found",
      });
    }

    for (const item of items) {
      if (!item.medicineId) {
        return res.status(400).json({
          success: false,
          message: "Each prescription item must have a medicineId",
        });
      }

      const medicine = await prisma.medicine.findUnique({
        where: {
          id: Number(item.medicineId),
        },
      });

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine with ID ${item.medicineId} not found`,
        });
      }
    }

    const prescription = await prisma.prescription.create({
      data: {
        clinicalRecordId: Number(clinicalRecordId),
        notes,
        items: {
          create: items.map((item) => ({
            medicineId: Number(item.medicineId),
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            quantity:
              item.quantity !== undefined
                ? Number(item.quantity)
                : null,
          })),
        },
      },
      include: {
        clinicalRecord: true,
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Create prescription error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      orderBy: {
        prescribedAt: "desc",
      },
      include: {
        clinicalRecord: true,
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions,
    });
  } catch (error) {
    console.error("Get prescriptions error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const prescriptionId = Number(req.params.id);

    const prescription = await prisma.prescription.findUnique({
      where: {
        id: prescriptionId,
      },
      include: {
        clinicalRecord: {
          include: {
            patient: true,
            doctor: true,
          },
        },
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    return res.status(200).json({
      success: true,
      prescription,
    });
  } catch (error) {
    console.error("Get prescription error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const prescriptionId = Number(req.params.id);
    const { notes } = req.body;

    const existingPrescription = await prisma.prescription.findUnique({
      where: {
        id: prescriptionId,
      },
    });

    if (!existingPrescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    const prescription = await prisma.prescription.update({
      where: {
        id: prescriptionId,
      },
      data: {
        ...(notes !== undefined && { notes }),
      },
      include: {
        clinicalRecord: true,
        items: {
          include: {
            medicine: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    console.error("Update prescription error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
};
