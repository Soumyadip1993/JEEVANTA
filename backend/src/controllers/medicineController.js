const prisma = require("../config/prisma");

const createMedicine = async (req, res) => {
  try {
    const {
      name,
      genericName,
      manufacturer,
      unit,
    } = req.body;

    if (!name || !genericName || !unit) {
      return res.status(400).json({
        success: false,
        message: "Name, generic name and unit are required",
      });
    }

    const medicine = await prisma.medicine.create({
      data: {
        name,
        genericName,
        manufacturer,
        unit,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      medicine,
    });
  } catch (error) {
    console.error("Create medicine error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMedicines = async (req, res) => {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        inventory: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    console.error("Get medicines error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMedicineById = async (req, res) => {
  try {
    const medicineId = Number(req.params.id);

    const medicine = await prisma.medicine.findUnique({
      where: {
        id: medicineId,
      },
      include: {
        inventory: true,
      },
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.status(200).json({
      success: true,
      medicine,
    });
  } catch (error) {
    console.error("Get medicine error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const medicineId = Number(req.params.id);

    const {
      name,
      genericName,
      manufacturer,
      unit,
    } = req.body;

    const existingMedicine = await prisma.medicine.findUnique({
      where: {
        id: medicineId,
      },
    });

    if (!existingMedicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    const medicine = await prisma.medicine.update({
      where: {
        id: medicineId,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(genericName !== undefined && { genericName }),
        ...(manufacturer !== undefined && { manufacturer }),
        ...(unit !== undefined && { unit }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      medicine,
    });
  } catch (error) {
    console.error("Update medicine error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
};
