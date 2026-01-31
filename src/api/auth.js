import { apiFetch } from "./client";
import { useNavigate } from "react-router-dom";
export function signup({ name, email, password, school, role }) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, school, role }),
  });
}

export function login({ email, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}


export function googleSignUp(form){
  return apiFetch("/auth/register/google",{
    method:"POST",
    body:JSON.stringify(form)
  })
}