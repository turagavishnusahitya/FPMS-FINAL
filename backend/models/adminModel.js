const pool = require("./db");

// Get admin user by ID (used for login authentication)
const getAdminById = async (login_id) => {
  const result = await pool.query(
    "SELECT * FROM admin_users WHERE admin_id = $1",
    [login_id]
  );
  return result.rows[0];
};

// Find admin by ID (alias for consistency)
const findAdminById = async (admin_id) => {
  return await getAdminById(admin_id);
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

// Create new admin user
const createAdminUser = async (userData) => {
  const { admin_id, password_hash, security_code, full_name, email } = userData;
  
  await pool.query(
    `INSERT INTO admin_users (admin_id, password_hash, security_code, full_name, email, created_at)
     VALUES ($1, $2, $3, $4, $5, NOW())`,
    [admin_id, password_hash, security_code, full_name, email]
  );
};

module.exports = {
  getAdminById,
  findAdminById,
  verifyAdminSecurityCode,
  updateAdminPassword,
  createAdminUser,
};