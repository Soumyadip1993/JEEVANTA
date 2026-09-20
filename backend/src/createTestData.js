require("dotenv").config();

const prisma = require("./config/prisma");

async function createTestData() {
  try {
    const department = await prisma.department.create({
      data: {
        name: "General Medicine",
        description: "General medical consultation department",
      },
    });

    console.log("Department created:");
    console.log(department);

    const doctorUser = await prisma.user.create({
      data: {
        name: "Dr. Amit Kumar",
        email: "doctor@jeevanta.gov.in",
        passwordHash: "TEMP",
        role: "DOCTOR",
      },
    });

    const doctor = await prisma.doctor.create({
      data: {
        userId: doctorUser.id,
        departmentId: department.id,
        specialization: "General Medicine",
        licenseNumber: "DOC-0001",
      },
    });

    console.log("Doctor created:");
    console.log(doctor);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
