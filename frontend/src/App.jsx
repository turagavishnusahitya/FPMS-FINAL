import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import FacultyDashboard from './components/FacultyDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import ForgotPassword from './components/ForgotPassword';
import AdminForgotPassword from './components/AdminForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Password reset routes */}
        <Route path="/faculty/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all for 404 */}
        <Route
          path="*"
          element={
            <div className="p-8 text-center text-red-600 font-bold text-xl">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;