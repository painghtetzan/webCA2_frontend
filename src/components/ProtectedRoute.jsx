import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../api/client";

export default function ProtectedRoute({ children, role }) {
  const token = getToken() 
  const user = getUser() 

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}
