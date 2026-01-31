import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/auth";
import GAuth from "../components/GAuth";
const SCHOOL_OPTIONS = [
  { value: "", label: "Select your school..." },
  { value: "DFT", label: "DFT" },
  { value: "DDD", label: "DDD" },
  { value: "DDDD", label: "DDDD" },
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Invalid email format (example: name@email.com).";

    if (!form.password) e.password = "Password is required.";
    else if (!isValidPassword(form.password))
      e.password = "8+ chars, include uppercase, lowercase, number and special character.";

    if (!form.school) e.school = "Please select a school.";
    if (!form.role) e.role = "Please select a role.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup(form);
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h2 className="page-title">Create account</h2>
      <p className="subtle">Sign up to manage submissions, events, meetings and reminders.</p>

      <form className="card form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g., Ye Lin Aung" />
        {errors.name ? <div className="error">{errors.name}</div> : null}

        <label>Email</label>
        <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="e.g., name@email.com" />
        <div className="helper">Use a valid email (example: name@email.com)</div>
        {errors.email ? <div className="error">{errors.email}</div> : null}

        <label>Password</label>
        <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Create a strong password" />
        <div className="helper">8+ chars, uppercase, lowercase, number, special char.</div>
        {errors.password ? <div className="error">{errors.password}</div> : null}

        <label>School</label>
        <select value={form.school} onChange={(e) => update("school", e.target.value)}>
          {SCHOOL_OPTIONS.map((s) => (
            <option key={s.value || "none"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {errors.school ? <div className="error">{errors.school}</div> : null}

        <label>Role</label>
        <select value={form.role} onChange={(e) => update("role", e.target.value)}>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
        </select>
        {errors.role ? <div className="error">{errors.role}</div> : null}

        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Account"}
        </button>

        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
      <GAuth name="Sign" />
    </div>
  );
}
