import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {

    const token = searchParams.get("token");
    const user = searchParams.get("user")
    localStorage.setItem("user",user );
    if (token) {
      
      try {
        
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        localStorage.setItem("token", payload);

        
        
        
        if (payload.role === "lecturer") {
          navigate("/lecturer");
        } else {
          navigate("/student");
        }
      } catch (err) {
        console.error("Token decoding failed", err);
        navigate("/"); 
      }
    } else {
      
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Authenticating...</h2>
      <p>Please wait while we set up your session.</p>
    </div>
  );
}