import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../api/client";

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const homePath = user?.role === "lecturer" ? "/lecturer" : "/student";

  return (
    <div className="nav">
      <div className="nav-inner">
        <Link to={homePath} className="brand">
          <span className="brand-badge" />
          EduReminder
        </Link>

        <div className="nav-right">
          {user ? (
            <>
              <span className="chip">{user.role}</span>
              <span className="chip">{user.school || "School"}</span>
              <span className="chip">{user.email}</span>
              <button className="btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">Login</Link>
              <Link className="btn primary" to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
