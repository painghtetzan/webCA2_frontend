import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import GAuth from "../components/GAuth";
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password) {
      setErr("Email and password are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setErr("Invalid email format.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await login({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "lecturer") navigate("/lecturer");
      else navigate("/student");
    } catch (error) {
      setErr(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h2 className="page-title">Welcome back</h2>
      <p className="subtle">Login to access your dashboard.</p>

      <form className="card form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />

        {err ? <div className="error">{err}</div> : null}

        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="muted">
          No account yet? <Link to="/signup">Signup</Link>
        </p>
      </form>
      
      <GAuth name="Login" />
    </div>
  );
}
