const express = require("express");
const router = express.Router();
const {
  loginFaculty,
  loginAdmin,
  resetFacultyPassword,
  resetAdminPassword,
} = require("../controllers/authController");

// Faculty login
router.post("/faculty/login", loginFaculty);

// Admin login
router.post("/admin/login", loginAdmin);

// Faculty password reset
router.post("/faculty/reset-password", resetFacultyPassword);

// Admin password reset
router.post("/admin/reset-password", resetAdminPassword);

module.exports = router;
