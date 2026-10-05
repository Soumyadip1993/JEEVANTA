const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const clinicalRecordRoutes = require("./routes/clinicalRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const labRoutes = require("./routes/labRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const dispensationRoutes = require("./routes/dispensationRoutes");
const nurseRoutes = require("./routes/nurseRoutes");
const vitalsRoutes = require("./routes/vitalsRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const bedRoutes = require("./routes/bedRoutes");

const pool = require("./config/database");
const prisma = require("./config/prisma");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/clinical-records", clinicalRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dispensations", dispensationRoutes);
app.use("/api/nurses", nurseRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/beds", bedRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Jeevanta API is running",
  });
});

app.get("/api/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "PostgreSQL database is connected",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Serve frontend static build
const frontendDist = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API endpoint not found",
    });
  }
  res.sendFile(path.join(frontendDist, "index.html"), (err) => {
    if (err) {
      res.status(200).send("Jeevanta API is running");
    }
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    await pool.query("SELECT NOW()");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Jeevanta backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
};

startServer();
