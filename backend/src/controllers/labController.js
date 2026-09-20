const prisma = require("../config/prisma");

const createLabTest = async (req, res) => {
  try {
    const {
      clinicalRecordId,
      testName,
    } = req.body;

    if (!clinicalRecordId || !testName) {
      return res.status(400).json({
        success: false,
        message: "Clinical record and test name are required",
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

    const labTest = await prisma.labTest.create({
      data: {
        clinicalRecordId: Number(clinicalRecordId),
        testName,
      },
      include: {
        clinicalRecord: {
          include: {
            patient: true,
            doctor: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Lab test created successfully",
      labTest,
    });
  } catch (error) {
    console.error("Create lab test error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLabTests = async (req, res) => {
  try {
    const labTests = await prisma.labTest.findMany({
      orderBy: {
        requestedAt: "desc",
      },
      include: {
        clinicalRecord: {
          include: {
            patient: true,
            doctor: true,
          },
        },
        result: true,
      },
    });

    return res.status(200).json({
      success: true,
      count: labTests.length,
      labTests,
    });
  } catch (error) {
    console.error("Get lab tests error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getLabTestById = async (req, res) => {
  try {
    const labTestId = Number(req.params.id);

    const labTest = await prisma.labTest.findUnique({
      where: {
        id: labTestId,
      },
      include: {
        clinicalRecord: {
          include: {
            patient: true,
            doctor: true,
          },
        },
        result: true,
      },
    });

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      });
    }

    return res.status(200).json({
      success: true,
      labTest,
    });
  } catch (error) {
    console.error("Get lab test error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateLabTestStatus = async (req, res) => {
  try {
    const labTestId = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const validStatuses = [
      "PENDING",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lab test status",
      });
    }

    const existingLabTest = await prisma.labTest.findUnique({
      where: {
        id: labTestId,
      },
    });

    if (!existingLabTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      });
    }

    const labTest = await prisma.labTest.update({
      where: {
        id: labTestId,
      },
      data: {
        status,
      },
      include: {
        clinicalRecord: true,
        result: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lab test status updated successfully",
      labTest,
    });
  } catch (error) {
    console.error("Update lab test status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createLabResult = async (req, res) => {
  try {
    const {
      labTestId,
      result,
      remarks,
    } = req.body;

    if (!labTestId) {
      return res.status(400).json({
        success: false,
        message: "Lab test ID is required",
      });
    }

    const labTest = await prisma.labTest.findUnique({
      where: {
        id: Number(labTestId),
      },
      include: {
        result: true,
      },
    });

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: "Lab test not found",
      });
    }

    if (labTest.result) {
      return res.status(409).json({
        success: false,
        message: "Lab result already exists for this test",
      });
    }

    const labResult = await prisma.labResult.create({
      data: {
        labTestId: Number(labTestId),
        result,
        remarks,
        completedAt: new Date(),
      },
      include: {
        labTest: {
          include: {
            clinicalRecord: {
              include: {
                patient: true,
                doctor: true,
              },
            },
          },
        },
      },
    });

    await prisma.labTest.update({
      where: {
        id: Number(labTestId),
      },
      data: {
        status: "COMPLETED",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Lab result created successfully",
      labResult,
    });
  } catch (error) {
    console.error("Create lab result error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateLabResult = async (req, res) => {
  try {
    const resultId = Number(req.params.id);
    const { result, remarks } = req.body;

    const existingResult = await prisma.labResult.findUnique({
      where: {
        id: resultId,
      },
    });

    if (!existingResult) {
      return res.status(404).json({
        success: false,
        message: "Lab result not found",
      });
    }

    const labResult = await prisma.labResult.update({
      where: {
        id: resultId,
      },
      data: {
        ...(result !== undefined && { result }),
        ...(remarks !== undefined && { remarks }),
        completedAt: new Date(),
      },
      include: {
        labTest: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lab result updated successfully",
      labResult,
    });
  } catch (error) {
    console.error("Update lab result error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createLabTest,
  getLabTests,
  getLabTestById,
  updateLabTestStatus,
  createLabResult,
  updateLabResult,
};
