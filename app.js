const express = require("express");
const cors = require("cors");  
const swaggerUi = require("swagger-ui-express");        
const swaggerSpec = require("./src/config/swagger");   
const app = express();

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const recordRoutes = require("./src/routes/record.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const errorHandler = require("./src/middleware/errorHandler");
const { globalLimiter, authLimiter } = require("./src/middleware/rateLimiter");

app.use(cors());     
app.use(express.json());
app.use(globalLimiter);


app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));  

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

module.exports = app;
