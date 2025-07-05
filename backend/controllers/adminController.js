const bcrypt = require("bcryptjs");
const {
  getAllSubmittedFaculty,
  getFacultySubmission,
  submitAdminScores,
} = require("../models/facultyModel");

const { getAdminById } = require("../models/adminModel"); // ⬅️ Add this

const getSubmittedFaculty = async (req, res) => {
  try {
    const facultyList = await getAllSubmittedFaculty();
    res.json(facultyList);
  } catch (err) {
    console.error("Fetch faculty error:", err);
    res.status(500).json({ message: "Error fetching faculty list" });
  }
};

const getProofByFaculty = async (req, res) => {
  const { faculty_id } = req.params;
  const year = parseInt(req.query.year);

  try {
    const proof = await getFacultySubmission(faculty_id, year);
    if (!proof) return res.status(404).json({ message: "No proof found" });
    res.json(proof);
  } catch (err) {
    console.error("Fetch proof error:", err);
    res.status(500).json({ message: "Error fetching proof" });
  }
};

const submitScores = async (req, res) => {
  const { faculty_id, year, scored_by, ...scoreData } = req.body;

  try {
    await submitAdminScores(faculty_id, year, scored_by, scoreData);
    res.json({ message: "Scores submitted successfully" });
  } catch (err) {
    console.error("Submit score error:", err);
    res.status(500).json({ message: "Error submitting scores" });
  }
};

// ✅ Add this function
const loginAdmin = async (req, res) => {
  const { admin_id, password } = req.body;

  try {
    const admin = await getAdminById(admin_id);
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.json({ message: "Admin login successful", admin });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSubmittedFaculty,
  getProofByFaculty,
  submitScores,
  loginAdmin, // ⬅️ export the new login function
};
