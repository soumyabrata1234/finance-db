const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Dashboard API",
      version: "1.0.0",
      description:
        "A role-based finance data processing and access control backend. Supports user management, financial records, and dashboard analytics.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
      {
        url: "https://finance-db.onrender.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "661f1c2e8a1b2c3d4e5f6789" },
            name: { type: "string", example: "Soumya Sinha" },
            email: { type: "string", example: "soumya@example.com" },
            role: { type: "string", enum: ["viewer", "analyst", "admin"] },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        FinancialRecord: {
          type: "object",
          properties: {
            _id: { type: "string", example: "661f1c2e8a1b2c3d4e5f6789" },
            amount: { type: "number", example: 5000 },
            type: { type: "string", enum: ["income", "expense"] },
            category: { type: "string", example: "Salary" },
            date: { type: "string", format: "date-time" },
            notes: { type: "string", example: "April salary" },
            createdBy: { $ref: "#/components/schemas/User" },
            isDeleted: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error description" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"], // reads JSDoc comments from all route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;