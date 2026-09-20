const prisma = require("../config/prisma");

const createDispensation = async (req, res) => {
  try {
    const {
      medicineId,
      patientId,
      quantity,
    } = req.body;

    if (
      medicineId === undefined ||
      patientId === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Medicine ID, patient ID and quantity are required",
      });
    }

    const dispenseQuantity = Number(quantity);

    if (!Number.isInteger(dispenseQuantity) || dispenseQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    const medicine = await prisma.medicine.findUnique({
      where: {
        id: Number(medicineId),
      },
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
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

    const inventory = await prisma.inventory.findUnique({
      where: {
        medicineId: Number(medicineId),
      },
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this medicine",
      });
    }

    if (inventory.quantity < dispenseQuantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient medicine stock",
        availableQuantity: inventory.quantity,
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const dispensation = await tx.dispensation.create({
        data: {
          medicineId: Number(medicineId),
          patientId: Number(patientId),
          quantity: dispenseQuantity,
        },
        include: {
          medicine: true,
          patient: true,
        },
      });

      const updatedInventory = await tx.inventory.update({
        where: {
          medicineId: Number(medicineId),
        },
        data: {
          quantity: {
            decrement: dispenseQuantity,
          },
        },
      });

      return {
        dispensation,
        updatedInventory,
      };
    });

    return res.status(201).json({
      success: true,
      message: "Medicine dispensed successfully",
      dispensation: result.dispensation,
      remainingStock: result.updatedInventory.quantity,
    });
  } catch (error) {
    console.error("Create dispensation error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getDispensations = async (req, res) => {
  try {
    const dispensations = await prisma.dispensation.findMany({
      orderBy: {
        dispensedAt: "desc",
      },
      include: {
        medicine: true,
        patient: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: dispensations.length,
      dispensations,
    });
  } catch (error) {
    console.error("Get dispensations error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getDispensationsByPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

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

    const dispensations = await prisma.dispensation.findMany({
      where: {
        patientId,
      },
      orderBy: {
        dispensedAt: "desc",
      },
      include: {
        medicine: true,
        patient: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: dispensations.length,
      dispensations,
    });
  } catch (error) {
    console.error("Get patient dispensations error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createDispensation,
  getDispensations,
  getDispensationsByPatient,
};
