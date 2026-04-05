const express = require("express");
const router = express.Router();
const {
  getSummary,
  getByCategory,
  getMonthlyTrends,
  getRecentActivity,
} = require("../controllers/dashboard.controller");
const { verifyJWT, checkRole } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get total income, expenses and net balance (Analyst, Admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                     totalExpenses:
 *                       type: number
 *                     netBalance:
 *                       type: number
 *                     incomeCount:
 *                       type: integer
 *                     expenseCount:
 *                       type: integer
 */
router.get("/summary", verifyJWT, checkRole("analyst", "admin"), getSummary);

/**
 * @swagger
 * /api/dashboard/by-category:
 *   get:
 *     summary: Get totals broken down by category (Analyst, Admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown
 */
router.get("/by-category", verifyJWT, checkRole("analyst", "admin"), getByCategory);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly income and expense trends (Analyst, Admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trends
 */
router.get("/trends", verifyJWT, checkRole("analyst", "admin"), getMonthlyTrends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent financial activity (Analyst, Admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of recent records to return
 *     responses:
 *       200:
 *         description: Recent records
 */
router.get("/recent", verifyJWT, checkRole("analyst", "admin"), getRecentActivity);

module.exports = router;