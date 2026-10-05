const prisma = require("../config/prisma");

// Create a bed
const createBed = async (req, res) => {
  try {
    const { wardId, bedNumber, status } = req.body;

    if (!wardId || !bedNumber) {
      return res.status(400).json({
        message: "wardId and bedNumber are required",
      });
    }

    const ward = await prisma.ward.findUnique({
      where: { id: Number(wardId) },
    });

    if (!ward) {
      return res.status(404).json({
        message: "Ward not found",
      });
    }

    const existingBed = await prisma.bed.findFirst({
      where: {
        wardId: Number(wardId),
        bedNumber,
      },
    });

    if (existingBed) {
      return res.status(409).json({
        message: "Bed with this number already exists in this ward",
      });
    }

    const bed = await prisma.bed.create({
      data: {
        wardId: Number(wardId),
        bedNumber,
        status: status || "AVAILABLE",
      },
      include: {
        ward: true,
      },
    });

    return res.status(201).json(bed);
  } catch (error) {
    console.error("Create bed error:", error);

    return res.status(500).json({
      message: "Failed to create bed",
    });
  }
};

// Get all beds
const getBeds = async (req, res) => {
  try {
    const { status, wardId } = req.query;

    const where = {};

    if (status) {
      where.status = status;
    }

    if (wardId) {
      where.wardId = Number(wardId);
    }

    const beds = await prisma.bed.findMany({
      where,
      include: {
        ward: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json(beds);
  } catch (error) {
    console.error("Get beds error:", error);

    return res.status(500).json({
      message: "Failed to fetch beds",
    });
  }
};

// Get bed by ID
const getBedById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid bed ID",
      });
    }

    const bed = await prisma.bed.findUnique({
      where: { id },
      include: {
        ward: true,
        admissions: {
          orderBy: {
            admissionDate: "desc",
          },
        },
      },
    });

    if (!bed) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    return res.status(200).json(bed);
  } catch (error) {
    console.error("Get bed error:", error);

    return res.status(500).json({
      message: "Failed to fetch bed",
    });
  }
};

// Update bed
const updateBed = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { bedNumber, status, wardId } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid bed ID",
      });
    }

    const existingBed = await prisma.bed.findUnique({
      where: { id },
    });

    if (!existingBed) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    // Do not allow manually changing an occupied bed to available.
    // Admission/discharge should control occupancy.
    if (
      existingBed.status === "OCCUPIED" &&
      status === "AVAILABLE"
    ) {
      return res.status(400).json({
        message: "Occupied bed must be released through patient discharge",
      });
    }

    const data = {};

    if (bedNumber !== undefined) {
      data.bedNumber = bedNumber;
    }

    if (status !== undefined) {
      data.status = status;
    }

    if (wardId !== undefined) {
      const ward = await prisma.ward.findUnique({
        where: { id: Number(wardId) },
      });

      if (!ward) {
        return res.status(404).json({
          message: "Ward not found",
        });
      }

      data.wardId = Number(wardId);
    }

    const updatedBed = await prisma.bed.update({
      where: { id },
      data,
      include: {
        ward: true,
      },
    });

    return res.status(200).json(updatedBed);
  } catch (error) {
    console.error("Update bed error:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Bed with this number already exists in this ward",
      });
    }

    return res.status(500).json({
      message: "Failed to update bed",
    });
  }
};

module.exports = {
  createBed,
  getBeds,
  getBedById,
  updateBed,
};
