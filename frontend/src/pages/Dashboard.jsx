import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { listFrom } from "../utils/data";

const roleConfig = {
  ADMIN: {
    title: "Administration Dashboard",
    subtitle: "Hospital-wide overview and system administration",
    cards: ["patients", "appointments", "beds", "labs"],
  },
  RECEPTIONIST: {
    title: "Reception Dashboard",
    subtitle: "Patient registration, appointments and admissions",
    cards: ["patients", "appointments", "admissions"],
  },
  DOCTOR: {
    title: "Doctor Dashboard",
    subtitle: "Consultations, clinical records and patient care",
    cards: ["appointments", "patients", "labs", "admissions"],
  },
  NURSE: {
    title: "Nursing Dashboard",
    subtitle: "Ward care, patient monitoring, vitals and admissions",
    cards: ["activeAdmissions", "availableBeds", "vitalsToday", "patients"],
  },
  LAB_TECHNICIAN: {
    title: "Laboratory Dashboard",
    subtitle: "Laboratory test processing and results",
    cards: ["pendingLabs", "inProgressLabs", "completedLabs"],
  },
  PHARMACIST: {
    title: "Pharmacy Dashboard",
    subtitle: "Medicine inventory and dispensing",
    cards: ["medicines", "lowStock", "dispensations"],
  },
};

const labels = {
  patients: "Patients",
  appointments: "Appointments Today",
  beds: "Available Beds",
  labs: "Pending Lab Tests",
  admissions: "Active Admissions",
  activeAdmissions: "Active Admissions",
  availableBeds: "Available Beds",
  vitalsToday: "Vitals Recorded Today",
  pendingLabs: "Pending Lab Tests",
  inProgressLabs: "Tests In Progress",
  completedLabs: "Completed Lab Tests",
  medicines: "Medicines",
  lowStock: "Low Stock Items",
  dispensations: "Dispensations",
};

export default function Dashboard() {
  const { user } = useAuth();
  const config = roleConfig[user?.role] || roleConfig.ADMIN;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const requests = {};

        const need = new Set(config.cards);
        if (need.has("patients")) requests.patients = api.get("/patients");
        if (need.has("appointments")) requests.appointments = api.get("/appointments");
        if (need.has("beds") || need.has("availableBeds")) requests.beds = api.get("/beds?status=AVAILABLE");
        if (need.has("labs") || need.has("pendingLabs") || need.has("inProgressLabs") || need.has("completedLabs")) requests.labs = api.get("/lab/tests");
        if (need.has("admissions") || need.has("activeAdmissions")) requests.admissions = api.get("/admissions");
        if (need.has("vitalsToday")) requests.vitals = api.get("/vitals");
        if (need.has("medicines")) requests.medicines = api.get("/medicines");
        if (need.has("lowStock")) requests.inventory = api.get("/inventory");
        if (need.has("dispensations")) requests.dispensations = api.get("/dispensations");

        const entries = Object.entries(requests);
        const responses = await Promise.all(entries.map(([, promise]) => promise));
        const raw = {};
        entries.forEach(([key], index) => { raw[key] = responses[index].data; });

        const patients = listFrom(raw.patients, ["patients"]);
        const appointments = listFrom(raw.appointments, ["appointments"]);
        const beds = listFrom(raw.beds, ["beds"]);
        const labs = listFrom(raw.labs, ["labTests", "tests"]);
        const admissions = listFrom(raw.admissions, ["admissions"]);
        const vitals = listFrom(raw.vitals, ["vitals"]);
        const medicines = listFrom(raw.medicines, ["medicines"]);
        const inventory = listFrom(raw.inventory, ["inventory"]);
        const dispensations = listFrom(raw.dispensations, ["dispensations"]);

        const today = new Date();
        const sameDay = (value) => {
          if (!value) return false;
          const d = new Date(value);
          return d.toDateString() === today.toDateString();
        };

        const result = {
          patients: patients.length,
          appointments: appointments.filter(a => sameDay(a.appointmentDate)).length,
          beds: beds.length,
          labs: labs.filter(t => t.status === "PENDING").length,
          admissions: admissions.filter(a => a.status === "ADMITTED").length,
          activeAdmissions: admissions.filter(a => a.status === "ADMITTED").length,
          availableBeds: beds.length,
          vitalsToday: vitals.filter(v => sameDay(v.recordedAt)).length,
          pendingLabs: labs.filter(t => t.status === "PENDING").length,
          inProgressLabs: labs.filter(t => t.status === "IN_PROGRESS").length,
          completedLabs: labs.filter(t => t.status === "COMPLETED").length,
          medicines: medicines.length,
          lowStock: inventory.filter(i => Number(i.quantity ?? 0) <= Number(i.reorderLevel ?? 10)).length,
          dispensations: dispensations.filter(d => sameDay(d.dispensedAt)).length,
        };

        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [user?.role]);

  const cards = useMemo(() => config.cards.map(key => [labels[key], data[key] ?? 0]), [config.cards, data]);

  return (
    <div>
      <div className="page-header">
        <div><h1>{config.title}</h1><p>{config.subtitle}</p></div>
        <span className="role-pill">{user?.role}</span>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="stats-grid">
        {cards.map(([title, value]) => (
          <div className="stat-card" key={title}>
            <span>{title}</span>
            <strong>{loading ? "..." : value}</strong>
          </div>
        ))}
      </div>

      <div className="welcome-card">
        <h2>{user?.role === "NURSE" ? "Nursing Care" : `Jeevanta ${user?.role?.replaceAll("_", " ")} Workspace`}</h2>
        <p>
          This dashboard only loads information and actions relevant to your role. Access to each API is still enforced by the backend.
        </p>
      </div>
    </div>
  );
}
