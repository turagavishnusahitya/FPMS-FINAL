const express = require("express");
const router = express.Router();
const {
  loginFaculty,
  loginAdmin,
  signupFaculty,
  signupAdmin,
  resetFacultyPassword,
  resetAdminPassword,
} = require("../controllers/authController");

// Faculty routes
router.post("/faculty/login", loginFaculty);
router.post("/faculty/signup", signupFaculty);
router.post("/faculty/reset-password", resetFacultyPassword);

// Admin routes
router.post("/admin/login", loginAdmin);
router.post("/admin/signup", signupAdmin);
router.post("/admin/reset-password", resetAdminPassword);

module.exports = router;