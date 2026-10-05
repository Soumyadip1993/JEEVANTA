const bcrypt = require("bcrypt");
const prisma = require("./config/prisma");

const createTestNurse = async () => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: "nurse@jeevanta.gov.in",
      },
    });

    if (existingUser) {
      console.log("Nurse user already exists:");
      console.log(existingUser);
      return;
    }

    const passwordHash = await bcrypt.hash("Nurse@123", 10);

    const nurseUser = await prisma.user.create({
      data: {
        name: "Priya Nurse",
        email: "nurse@jeevanta.gov.in",
        passwordHash,
        role: "NURSE",
        isActive: true,
      },
    });

    console.log("Nurse user created successfully:");
    console.log(nurseUser);
  } catch (error) {
    console.error("Error creating nurse user:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createTestNurse();
