const express = require("express");
const router = express.Router();
const {
  submitProof,
  getProofSubmission,
  loginFaculty, // newly added
} = require("../controllers/facultyController");

// Faculty login route
router.post("/login", loginFaculty);

// Existing proof routes
router.post("/submit", submitProof);
router.get("/proof/:faculty_id", getProofSubmission);

module.exports = router;
