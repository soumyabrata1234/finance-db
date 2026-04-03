const express = require("express");
const router = express.Router();

const { getAllUsers,updateUserRole, updateUserStatus, } = require("../controllers/user.controller");

const { verifyJWT, checkRole } = require("../middleware/auth.middleware");

router.get("/", verifyJWT, checkRole("admin"), getAllUsers);

router.patch("/:id/role", verifyJWT, checkRole("admin"), updateUserRole);
router.patch("/:id/status", verifyJWT, checkRole("admin"), updateUserStatus);

module.exports = router;

