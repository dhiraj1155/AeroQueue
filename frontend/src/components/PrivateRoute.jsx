// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // check if token exists
  return token ? children : <Navigate to="/login" replace />; // redirect if no token
};

export default PrivateRoute;
