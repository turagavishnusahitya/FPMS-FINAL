const bcrypt = require("bcryptjs");
const {
  findFacultyById,
  findFacultyByIdAndCode,
  createFacultyUser,
} = require("../models/facultyModel");
const {
  findAdminById,
  verifyAdminSecurityCode,
  updateAdminPassword,
  createAdminUser,
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

// 📝 Faculty Signup
const signupFaculty = async (req, res) => {
  const { login_id, password, security_code, full_name, department, email } = req.body;

  try {
    // Check if faculty already exists
    const existingFaculty = await findFacultyById(login_id);
    if (existingFaculty) {
      return res.status(400).json({ message: "Faculty ID already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create faculty user
    await createFacultyUser({
      login_id,
      password_hash: hashedPassword,
      security_code,
      full_name,
      department,
      email
    });

    res.status(201).json({ message: "Faculty account created successfully" });
  } catch (err) {
    console.error("Faculty signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📝 Admin Signup
const signupAdmin = async (req, res) => {
  const { admin_id, password, security_code, full_name, email } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await findAdminById(admin_id);
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin ID already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    await createAdminUser({
      admin_id,
      password_hash: hashedPassword,
      security_code,
      full_name,
      email
    });

    res.status(201).json({ message: "Admin account created successfully" });
  } catch (err) {
    console.error("Admin signup error:", err);
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
  signupFaculty,
  signupAdmin,
  resetFacultyPassword,
  resetAdminPassword,
};