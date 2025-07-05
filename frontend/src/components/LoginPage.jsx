import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [facultyId, setFacultyId] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect only if authenticated and role is present
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const userType = localStorage.getItem('userType');

  if (isAuthenticated && userType === 'faculty') return <Navigate to="/faculty" replace />;
  if (isAuthenticated && userType === 'admin') return <Navigate to="/admin" replace />;

  const handleFacultyLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/faculty/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: facultyId, password: facultyPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'faculty');
        localStorage.setItem('userId', facultyId);
        navigate('/faculty');
      } else {
        setError(data.message || 'Faculty login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminId, password: adminPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('adminId', adminId);
        navigate('/admin');
      } else {
        setError(data.message || 'Admin login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-700">Faculty Performance Portal</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-5xl">
        {/* Faculty Login */}
        <form onSubmit={handleFacultyLogin} className="bg-white p-6 rounded shadow-md w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Faculty Login</h2>
          <input
            type="text"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
            placeholder="Faculty ID (e.g. VIT0021)"
            required
          />
          <input
            type="password"
            value={facultyPassword}
            onChange={(e) => setFacultyPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
            placeholder="Password"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </button>
          <div className="mt-4 text-sm">
            <Link to="/faculty/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>

        {/* Admin Login */}
        <form onSubmit={handleAdminLogin} className="bg-white p-6 rounded shadow-md w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
            placeholder="Admin ID"
            required
          />
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded"
            placeholder="Password"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Login
          </button>
          <div className="mt-4 text-sm">
            <Link to="/admin/forgot-password" className="text-green-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

