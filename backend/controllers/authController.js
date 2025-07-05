const bcrypt = require("bcryptjs");
const {
  findFacultyById,
  findFacultyByIdAndCode,
} = require("../models/facultyModel");
const {
  findAdminById,
  verifyAdminSecurityCode,
  updateAdminPassword,
} = require("../models/adminModel");

const pool = require("../models/db");

// 🔐 Faculty Login
const loginFaculty = async (req, res) => {
  const { login_id, password } = req.body;

  try {
    const user = await findFacultyById(login_id);
    if (!user) return res.status(404).json({ message: "Faculty not found" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Faculty login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 Admin Login
const loginAdmin = async (req, res) => {
  const { admin_id, password } = req.body;

  try {
    const admin = await findAdminById(admin_id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Admin login successful" });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔁 Faculty Password Reset
const resetFacultyPassword = async (req, res) => {
  const { faculty_id, security_code, new_password } = req.body;

  try {
    const user = await findFacultyByIdAndCode(faculty_id, security_code);
    if (!user)
      return res
        .status(401)
        .json({ message: "Invalid faculty ID or security code" });

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await pool.query(
      "UPDATE faculty_users SET password_hash = $1 WHERE login_id = $2",
      [hashedPassword, faculty_id]
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Faculty password reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔁 Admin Password Reset
const resetAdminPassword = async (req, res) => {
  const { admin_id, security_code, new_password } = req.body;

  try {
    const admin = await verifyAdminSecurityCode(admin_id, security_code);
    if (!admin)
      return res
        .status(401)
        .json({ message: "Invalid admin ID or security code" });

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await updateAdminPassword(admin_id, hashedPassword);

    res.status(200).json({ message: "Admin password reset successful" });
  } catch (error) {
    console.error("Admin password reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  loginFaculty,
  loginAdmin,
  resetFacultyPassword,
  resetAdminPassword,
};
