import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(""); setSaving(true);
    try { await login(email, password); navigate("/dashboard"); }
    catch (err) { setError(err.response?.data?.message || "Invalid email or password."); }
    finally { setSaving(false); }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo"><span>J</span></div>
        <h1>Jeevanta</h1>
        <p className="login-subtitle">Government Hospital Management System</p>
        <form onSubmit={submit} className="stack-form">
          <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Enter email"/></label>
          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Enter password"/></label>
          {error && <div className="alert error">{error}</div>}
          <button className="primary-button wide" disabled={saving}>{saving ? "Signing in..." : "Sign In"}</button>
        </form>
      </div>
    </div>
  );
}
