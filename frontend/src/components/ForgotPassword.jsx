import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [facultyId, setFacultyId] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/faculty/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          faculty_id: facultyId,
          security_code: securityCode,
          new_password: newPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('✅ Password reset successfully.');
        setFacultyId('');
        setSecurityCode('');
        setNewPassword('');
      } else {
        setStatus(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      setStatus('❌ Server error or not reachable.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Faculty ID"
          value={facultyId}
          onChange={(e) => setFacultyId(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Security Code"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Reset Password
        </button>
      </form>

      {status && (
        <div className="mt-4 text-center">
          <p>{status}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-3 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
