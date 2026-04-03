const express = require("express");
const router = express.Router();
const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/record.controller");
const { verifyJWT, checkRole } = require("../middleware/auth.middleware");

// Analyst and Admin can read
router.get("/", verifyJWT, checkRole("analyst", "admin"), getAllRecords);
router.get("/:id", verifyJWT, checkRole("analyst", "admin"), getRecordById);

// Admin only for write operations
router.post("/", verifyJWT, checkRole("admin"), createRecord);
router.patch("/:id", verifyJWT, checkRole("admin"), updateRecord);
router.delete("/:id", verifyJWT, checkRole("admin"), deleteRecord);

module.exports = router;