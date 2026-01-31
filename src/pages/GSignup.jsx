import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { googleSignUp } from "../api/auth";
import { useSearchParams } from "react-router-dom";
const SCHOOL_OPTIONS = [
  { value: "", label: "Select your school..." },
  { value: "DFT", label: "DFT" },
  { value: "DDD", label: "DDD" },
  { value: "DDDD", label: "DDDD" },
];



export default function GSignup() {
    const email = useSearchParams().get('email')
    

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email:email,
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
      const data =await googleSignUp(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "lecturer") navigate("/lecturer");
      else navigate("/student");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h2 className="page-title">Register with Google</h2>
      <p className="subtle">Please fill up the form for further specification.</p>

      <form className="card form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g., Ye Lin Aung" />
        {errors.name ? <div className="error">{errors.name}</div> : null}

        

       

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

     
      </form>
      
    </div>
  );
}
