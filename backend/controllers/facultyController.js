const bcrypt = require("bcryptjs");
const {
  upsertProofSubmission,
  saveDraftSubmission,
  deleteFacultySubmission,
  getFacultySubmission,
  getFacultyById,
} = require("../models/facultyModel");

// Faculty login controller
const loginFaculty = async (req, res) => {
  const { login_id, password } = req.body;

  try {
    const faculty = await getFacultyById(login_id);

    if (!faculty) {
      return res.status(401).json({ message: "Invalid faculty credentials" });
    }

    // Use bcrypt to compare the hashed password
    const isMatch = await bcrypt.compare(password, faculty.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid faculty credentials" });
    }

    res.json({ message: "Login successful", faculty });
  } catch (err) {
    console.error("Faculty login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Faculty proof submission controller (final submit)
const submitProof = async (req, res) => {
  const { faculty_id, year, ...proofData } = req.body;

  try {
    await upsertProofSubmission(faculty_id, year, { ...proofData, is_draft: false });
    res.json({ message: "Proof submission successful" });
  } catch (err) {
    console.error("Proof submission error:", err);
    res.status(500).json({ message: "Error submitting proof" });
  }
};

// Faculty save draft controller
const saveDraft = async (req, res) => {
  const { faculty_id, year, ...proofData } = req.body;

  try {
    await saveDraftSubmission(faculty_id, year, proofData);
    res.json({ message: "Draft saved successfully" });
  } catch (err) {
    console.error("Save draft error:", err);
    res.status(500).json({ message: "Error saving draft" });
  }
};

// Faculty delete submission controller
const deleteSubmission = async (req, res) => {
  const { faculty_id } = req.params;
  const year = parseInt(req.query.year);

  try {
    await deleteFacultySubmission(faculty_id, year);
    res.json({ message: "Submission deleted successfully" });
  } catch (err) {
    console.error("Delete submission error:", err);
    res.status(500).json({ message: "Error deleting submission" });
  }
};

// Faculty proof fetching controller
const getProofSubmission = async (req, res) => {
  const { faculty_id } = req.params;
  const year = parseInt(req.query.year);

  try {
    const submission = await getFacultySubmission(faculty_id, year);
    if (!submission) {
      return res.status(404).json({ message: "No submission found" });
    }
    res.json(submission);
  } catch (err) {
    console.error("Fetch proof error:", err);
    res.status(500).json({ message: "Error fetching proof" });
  }
};

module.exports = {
  loginFaculty,
  submitProof,
  saveDraft,
  deleteSubmission,
  getProofSubmission,
};