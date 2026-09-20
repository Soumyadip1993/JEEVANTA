const prisma = require("../config/prisma");

const createInventory = async (req, res) => {
  try {
    const {
      medicineId,
      quantity,
      reorderLevel,
    } = req.body;

    if (
      medicineId === undefined ||
      quantity === undefined ||
      reorderLevel === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Medicine ID, quantity and reorder level are required",
      });
    }

    if (Number(quantity) < 0 || Number(reorderLevel) < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity and reorder level cannot be negative",
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

    const existingInventory = await prisma.inventory.findUnique({
      where: {
        medicineId: Number(medicineId),
      },
    });

    if (existingInventory) {
      return res.status(409).json({
        success: false,
        message: "Inventory already exists for this medicine",
      });
    }

    const inventory = await prisma.inventory.create({
      data: {
        medicineId: Number(medicineId),
        quantity: Number(quantity),
        reorderLevel: Number(reorderLevel),
      },
      include: {
        medicine: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Inventory created successfully",
      inventory,
    });
  } catch (error) {
    console.error("Create inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      orderBy: {
        medicineId: "asc",
      },
      include: {
        medicine: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: inventory.length,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getInventoryByMedicineId = async (req, res) => {
  try {
    const medicineId = Number(req.params.medicineId);

    const inventory = await prisma.inventory.findUnique({
      where: {
        medicineId,
      },
      include: {
        medicine: true,
      },
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this medicine",
      });
    }

    return res.status(200).json({
      success: true,
      inventory,
    });
  } catch (error) {
    console.error("Get inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateInventory = async (req, res) => {
  try {
    const medicineId = Number(req.params.medicineId);

    const {
      quantity,
      reorderLevel,
    } = req.body;

    const existingInventory = await prisma.inventory.findUnique({
      where: {
        medicineId,
      },
    });

    if (!existingInventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this medicine",
      });
    }

    if (
      (quantity !== undefined && Number(quantity) < 0) ||
      (reorderLevel !== undefined && Number(reorderLevel) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity and reorder level cannot be negative",
      });
    }

    const inventory = await prisma.inventory.update({
      where: {
        medicineId,
      },
      data: {
        ...(quantity !== undefined && {
          quantity: Number(quantity),
        }),
        ...(reorderLevel !== undefined && {
          reorderLevel: Number(reorderLevel),
        }),
      },
      include: {
        medicine: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      inventory,
    });
  } catch (error) {
    console.error("Update inventory error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createInventory,
  getInventory,
  getInventoryByMedicineId,
  updateInventory,
};
