const prisma = require("../config/prisma");

const createNurse = async (req, res) => {
  try {
    const { userId, departmentId } = req.body;

    if (userId === undefined) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "NURSE") {
      return res.status(400).json({
        success: false,
        message: "User must have NURSE role",
      });
    }

    const existingNurse = await prisma.nurse.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (existingNurse) {
      return res.status(409).json({
        success: false,
        message: "This user is already registered as a nurse",
      });
    }

    if (departmentId !== undefined && departmentId !== null) {
      const department = await prisma.department.findUnique({
        where: {
          id: Number(departmentId),
        },
      });

      if (!department) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }
    }

    const nurse = await prisma.nurse.create({
      data: {
        userId: Number(userId),
        departmentId:
          departmentId !== undefined && departmentId !== null
            ? Number(departmentId)
            : null,
      },
      include: {
        user: true,
        department: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Nurse created successfully",
      nurse,
    });
  } catch (error) {
    console.error("Create nurse error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getNurses = async (req, res) => {
  try {
    const nurses = await prisma.nurse.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        user: true,
        department: true,
        vitals: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: nurses.length,
      nurses,
    });
  } catch (error) {
    console.error("Get nurses error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getNurseById = async (req, res) => {
  try {
    const nurseId = Number(req.params.id);

    const nurse = await prisma.nurse.findUnique({
      where: {
        id: nurseId,
      },
      include: {
        user: true,
        department: true,
        vitals: true,
      },
    });

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: "Nurse not found",
      });
    }

    return res.status(200).json({
      success: true,
      nurse,
    });
  } catch (error) {
    console.error("Get nurse error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createNurse,
  getNurses,
  getNurseById,
};
