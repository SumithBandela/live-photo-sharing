// src/utils/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserInfo } from './auth'; // your jwt_decode-based auth utility

export function PrivateRoute({ children }) {
  const user = getUserInfo();
  return user ? children : <Navigate to="/login" />;
}
