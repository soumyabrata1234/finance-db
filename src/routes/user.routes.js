const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/user.controller");
const { verifyJWT, checkRole } = require("../middleware/auth.middleware");

router.get("/", verifyJWT, checkRole("viewer", "admin"), getAllUsers);

module.exports = router;