const express = require("express");
const router = express.Router();
const {
  getSummary,
  getByCategory,
  getMonthlyTrends,
  getRecentActivity,
} = require("../controllers/dashboard.controller");
const { verifyJWT, checkRole } = require("../middleware/auth.middleware");

// Analyst and Admin can access all dashboard routes
router.get("/summary", verifyJWT, checkRole("analyst", "admin"), getSummary);
router.get("/by-category", verifyJWT, checkRole("analyst", "admin"), getByCategory);
router.get("/trends", verifyJWT, checkRole("analyst", "admin"), getMonthlyTrends);
router.get("/recent", verifyJWT, checkRole("analyst", "admin"), getRecentActivity);

module.exports = router;