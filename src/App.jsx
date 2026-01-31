import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import LecturerDashboard from "./pages/LecturerDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GSignup from "./pages/GSignup.jsx";
import LoginSuccess from "./components/SuccessLogin.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/gsignup' element={<GSignup />} />
        <Route path='/loginsuccess' element={<LoginSuccess />} />
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute role="lecturer">
              <LecturerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
