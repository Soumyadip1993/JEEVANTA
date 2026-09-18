require("dotenv").config();

const bcrypt = require("bcrypt");
const prisma = require("./config/prisma");

async function createAdmin() {
  try {
    const email = "admin@jeevanta.gov.in";
    const password = "Admin@123";
    const name = "Jeevanta Admin";

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("Admin user already exists.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log("Admin created successfully.");
    console.log("Email:", admin.email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
