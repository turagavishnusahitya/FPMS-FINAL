const express = require("express");
const router = express.Router();
const {
  submitProof,
  saveDraft,
  deleteSubmission,
  getProofSubmission,
  loginFaculty,
} = require("../controllers/facultyController");

// Faculty login route
router.post("/login", loginFaculty);

// Proof management routes
router.post("/submit", submitProof);
router.post("/save-draft", saveDraft);
router.delete("/submission/:faculty_id", deleteSubmission);
router.get("/proof/:faculty_id", getProofSubmission);

module.exports = router;