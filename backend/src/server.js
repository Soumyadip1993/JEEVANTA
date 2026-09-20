const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const clinicalRecordRoutes = require("./routes/clinicalRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/clinical-records", clinicalRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Jeevanta backend running on port ${PORT}`);
});
