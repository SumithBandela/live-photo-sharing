// utils/auth.js
import { jwtDecode } from 'jwt-decode';

export function getUserInfo() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}

export function removeToken() {
  localStorage.removeItem("token");
}