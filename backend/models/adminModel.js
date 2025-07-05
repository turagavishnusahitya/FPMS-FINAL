// backend/models/adminModel.js
const pool = require("./db");

// Get admin user by ID (used for login authentication)
const getAdminById = async (login_id) => {
  const result = await pool.query(
    "SELECT * FROM admin_users WHERE admin_id = $1",
    [login_id]
  );
  return result.rows[0];
};

// Verify that a login_id and security code match
const verifyAdminSecurityCode = async (login_id, security_code) => {
  const result = await pool.query(
    "SELECT * FROM admin_users WHERE admin_id = $1 AND security_code = $2",
    [login_id, security_code]
  );
  return result.rows[0];
};

// Update the admin password
const updateAdminPassword = async (login_id, hashedPassword) => {
  await pool.query(
    "UPDATE admin_users SET password_hash = $1 WHERE admin_id = $2",
    [hashedPassword, login_id]
  );
};

module.exports = {
  getAdminById,
  verifyAdminSecurityCode,
  updateAdminPassword,
};
