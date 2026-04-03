const express = require("express");
const app = express();

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const recordRoutes = require("./src/routes/record.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const errorHandler = require("./src/middleware/errorHandler");
const { globalLimiter, authLimiter } = require("./src/middleware/rateLimiter"); // add this

app.use(express.json());

// Apply global limiter to all routes
app.use(globalLimiter);                                  // add this

// Routes
app.use("/api/auth", authLimiter, authRoutes);           // authLimiter only on auth
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;