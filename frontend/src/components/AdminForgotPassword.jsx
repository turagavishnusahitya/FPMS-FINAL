import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminForgotPassword = () => {
  const [loginId, setLoginId] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        admin_id: loginId,
        security_code: securityCode,
        new_password: newPassword,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('✅ Password reset successfully.');
      setResetSuccess(true);
    } else {
      setStatus(`❌ ${data.message}`);
      setResetSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Admin Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Admin ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          placeholder="Security Code"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
          className="w-full border p-2"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Reset Password
        </button>
      </form>

      {status && <p className="mt-3 text-green-700">{status}</p>}

      {resetSuccess && (
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminForgotPassword;

