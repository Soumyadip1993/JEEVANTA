require("dotenv").config();

const prisma = require("./config/prisma");

async function createTestMedicine() {
  try {
    const medicine = await prisma.medicine.create({
      data: {
        name: "Paracetamol 500mg",
        genericName: "Paracetamol",
        manufacturer: "Jeevanta Pharma",
        unit: "Tablet",
      },
    });

    console.log("Medicine created:");
    console.log(medicine);
  } catch (error) {
    console.error("Error creating medicine:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestMedicine();
