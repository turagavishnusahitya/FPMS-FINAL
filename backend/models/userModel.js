// backend/models/userModel.js
const pool = require("./db");

const findFacultyById = async (login_id) => {
  const result = await pool.query(
    "SELECT * FROM faculty_users WHERE login_id = $1",
    [login_id]
  );
  return result.rows[0];
};

module.exports = {
  findFacultyById,
};
