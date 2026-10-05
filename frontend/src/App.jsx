import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import ClinicalRecords from "./pages/ClinicalRecords";
import Prescriptions from "./pages/Prescriptions";
import Laboratory from "./pages/Laboratory";
import Pharmacy from "./pages/Pharmacy";
import Wards from "./pages/Wards";
import Nurses from "./pages/Nurses";
import Vitals from "./pages/Vitals";
import Admissions from "./pages/Admissions";
import Placeholder from "./pages/Placeholder";

const allStaff = ["ADMIN","RECEPTIONIST","DOCTOR","NURSE","LAB_TECHNICIAN","PHARMACIST"];

export default function App(){
 return <BrowserRouter><AuthProvider><Routes>
  <Route path="/login" element={<Login/>}/>
  <Route element={<ProtectedRoute/>}>
   <Route element={<Layout/>}>
    <Route path="/dashboard" element={<RoleRoute roles={allStaff}><Dashboard/></RoleRoute>}/>
    <Route path="/patients" element={<RoleRoute roles={["ADMIN","RECEPTIONIST","DOCTOR","NURSE"]}><Patients/></RoleRoute>}/>
    <Route path="/appointments" element={<RoleRoute roles={["ADMIN","RECEPTIONIST","DOCTOR","NURSE"]}><Appointments/></RoleRoute>}/>
    <Route path="/clinical-records" element={<RoleRoute roles={["ADMIN","DOCTOR","NURSE"]}><ClinicalRecords/></RoleRoute>}/>
    <Route path="/prescriptions" element={<RoleRoute roles={["ADMIN","DOCTOR","PHARMACIST"]}><Prescriptions/></RoleRoute>}/>
    <Route path="/laboratory" element={<RoleRoute roles={["ADMIN","DOCTOR","LAB_TECHNICIAN"]}><Laboratory/></RoleRoute>}/>
    <Route path="/pharmacy" element={<RoleRoute roles={["ADMIN","PHARMACIST"]}><Pharmacy/></RoleRoute>}/>
    <Route path="/wards" element={<RoleRoute roles={["ADMIN","DOCTOR","NURSE","RECEPTIONIST"]}><Wards/></RoleRoute>}/>
    <Route path="/nurses" element={<RoleRoute roles={["ADMIN"]}><Nurses/></RoleRoute>}/>
    <Route path="/vitals" element={<RoleRoute roles={["ADMIN","DOCTOR","NURSE"]}><Vitals/></RoleRoute>}/>
    <Route path="/admissions" element={<RoleRoute roles={["ADMIN","DOCTOR","NURSE","RECEPTIONIST"]}><Admissions/></RoleRoute>}/>
    <Route path="*" element={<Placeholder title="Jeevanta"/>}/>
   </Route>
  </Route>
  <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
  <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
 </Routes></AuthProvider></BrowserRouter>
}
