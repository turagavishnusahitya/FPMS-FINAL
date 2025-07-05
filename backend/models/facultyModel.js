const pool = require("./db");

// Insert or update faculty proof submission
const upsertProofSubmission = async (faculty_id, year, data) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const query = `
    INSERT INTO faculty_submissions (faculty_id, year, ${fields.join(", ")})
    VALUES ($1, $2, ${fields.map((_, i) => `$${i + 3}`).join(", ")})
    ON CONFLICT (faculty_id, year)
    DO UPDATE SET ${fields.map((f, i) => `${f} = $${i + 3}`).join(", ")};
  `;
  await pool.query(query, [faculty_id, year, ...values]);
};

// Save draft submission (without marking as submitted)
const saveDraftSubmission = async (faculty_id, year, data) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const query = `
    INSERT INTO faculty_submissions (faculty_id, year, ${fields.join(", ")}, is_draft)
    VALUES ($1, $2, ${fields.map((_, i) => `$${i + 3}`).join(", ")}, true)
    ON CONFLICT (faculty_id, year)
    DO UPDATE SET ${fields.map((f, i) => `${f} = $${i + 3}`).join(", ")}, is_draft = true;
  `;
  await pool.query(query, [faculty_id, year, ...values]);
};

// Delete a faculty submission
const deleteFacultySubmission = async (faculty_id, year) => {
  await pool.query(
    "DELETE FROM faculty_submissions WHERE faculty_id = $1 AND year = $2",
    [faculty_id, year]
  );
};

// Get a faculty member's proof submission for a year
const getFacultySubmission = async (faculty_id, year) => {
  const result = await pool.query(
    "SELECT * FROM faculty_submissions WHERE faculty_id = $1 AND year = $2",
    [faculty_id, year]
  );
  return result.rows[0];
};

// Get all faculty who have submitted proofs
const getAllSubmittedFaculty = async () => {
  const result = await pool.query(
    "SELECT DISTINCT faculty_id FROM faculty_submissions WHERE is_draft = false OR is_draft IS NULL"
  );
  return result.rows;
};

// Insert admin scores for a faculty
const submitAdminScores = async (faculty_id, year, scored_by, scoreData) => {
  const fields = Object.keys(scoreData);
  const values = Object.values(scoreData);

  const query = `
    INSERT INTO admin_scores (faculty_id, year, scored_by, ${fields.join(", ")})
    VALUES ($1, $2, $3, ${fields.map((_, i) => `$${i + 4}`).join(", ")})
    ON CONFLICT (faculty_id, year)
    DO UPDATE SET ${fields.map((f, i) => `${f} = $${i + 4}`).join(", ")};
  `;
  await pool.query(query, [faculty_id, year, scored_by, ...values]);
};

// Get faculty by login_id (for login authentication)
const getFacultyById = async (login_id) => {
  const result = await pool.query(
    "SELECT * FROM faculty_users WHERE login_id = $1",
    [login_id]
  );
  return result.rows[0];
};

// Find faculty by login_id (alias for consistency)
const findFacultyById = async (login_id) => {
  return await getFacultyById(login_id);
};

// Verify that a login_id and security code match
const findFacultyByIdAndCode = async (login_id, security_code) => {
  const result = await pool.query(
    "SELECT * FROM faculty_users WHERE login_id = $1 AND security_code = $2",
    [login_id, security_code]
  );
  return result.rows[0];
};

// Update the faculty password
const updateFacultyPassword = async (login_id, hashedPassword) => {
  await pool.query(
    "UPDATE faculty_users SET password_hash = $1 WHERE login_id = $2",
    [hashedPassword, login_id]
  );
};

// Create new faculty user
const createFacultyUser = async (userData) => {
  const { login_id, password_hash, security_code, full_name, department, email } = userData;
  
  await pool.query(
    `INSERT INTO faculty_users (login_id, password_hash, security_code, full_name, department, email, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [login_id, password_hash, security_code, full_name, department, email]
  );
};

module.exports = {
  upsertProofSubmission,
  saveDraftSubmission,
  deleteFacultySubmission,
  getFacultySubmission,
  getAllSubmittedFaculty,
  submitAdminScores,
  getFacultyById,
  findFacultyById,
  findFacultyByIdAndCode,
  updateFacultyPassword,
  createFacultyUser,
};