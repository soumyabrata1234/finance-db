const express = require("express");
const app = express();

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const recordRoutes = require("./src/routes/record.routes");  

const errorHandler = require("./src/middleware/errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);   

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;