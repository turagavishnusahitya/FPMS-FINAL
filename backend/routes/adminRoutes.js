// backend/routes/adminRoutes.js

const express = require("express");
const router = express.Router();

// Import the entire controller object
const adminController = require("../controllers/adminController");

// Admin login route
router.post("/login", adminController.loginAdmin);

// Get list of all submitted faculty
router.get("/faculty-submissions", adminController.getSubmittedFaculty);

// Get proof documents submitted by a faculty member
router.get("/proofs/:faculty_id", adminController.getProofByFaculty);

// Submit scores for a faculty member
router.post("/submit-score", adminController.submitScores);

module.exports = router;
