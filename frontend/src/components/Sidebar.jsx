import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const items = [
  ["Dashboard", "/dashboard", ["ADMIN","RECEPTIONIST","DOCTOR","NURSE","LAB_TECHNICIAN","PHARMACIST"]],
  ["Patients", "/patients", ["ADMIN","RECEPTIONIST","DOCTOR","NURSE"]],
  ["Appointments", "/appointments", ["ADMIN","RECEPTIONIST","DOCTOR","NURSE"]],
  ["Clinical Records", "/clinical-records", ["ADMIN","DOCTOR","NURSE"]],
  ["Prescriptions", "/prescriptions", ["ADMIN","DOCTOR","PHARMACIST"]],
  ["Laboratory", "/laboratory", ["ADMIN","DOCTOR","LAB_TECHNICIAN"]],
  ["Pharmacy", "/pharmacy", ["ADMIN","PHARMACIST"]],
  ["Wards & Beds", "/wards", ["ADMIN","DOCTOR","NURSE"]],
  ["Nurses", "/nurses", ["ADMIN"]],
  ["Vitals", "/vitals", ["ADMIN","DOCTOR","NURSE"]],
  ["Admissions", "/admissions", ["ADMIN","DOCTOR","NURSE","RECEPTIONIST"]],
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const visible = items.filter(([, , roles]) => roles.includes(user?.role));
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">J</div>
        <div><h1>Jeevanta</h1><span>Government Hospital</span></div>
      </div>
      <nav className="nav-list">
        {visible.map(([label, path]) => (
          <NavLink key={path} to={path} className={({isActive}) => `nav-link ${isActive ? "active":""}`}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="avatar">{(user?.name || "U").charAt(0).toUpperCase()}</div>
        <div className="user-copy"><strong>{user?.name}</strong><span>{user?.role}</span></div>
        <button className="logout-button" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
