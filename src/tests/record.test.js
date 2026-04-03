const request = require("supertest");
const app = require("../../app");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

describe("Record Routes", () => {
  let adminToken;
  let analystToken;
  let recordId;

  beforeAll(async () => {
    const admin = await User.create({
      name: "Admin",
      email: "recordadmin@example.com",
      password: "123456",
      role: "admin",
    });
    adminToken = signToken(admin._id, admin.role);

    const analyst = await User.create({
      name: "Analyst",
      email: "recordanalyst@example.com",
      password: "123456",
      role: "analyst",
    });
    analystToken = signToken(analyst._id, analyst.role);
  });

  describe("POST /api/records", () => {
    it("should create a record for admin", async () => {
      const res = await request(app)
        .post("/api/records")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          amount: 5000,
          type: "income",
          category: "Salary",
          date: "2026-04-01",
          notes: "April salary",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(5000);
      recordId = res.body.data._id;
    });

    it("should return 403 for analyst", async () => {
      const res = await request(app)
        .post("/api/records")
        .set("Authorization", `Bearer ${analystToken}`)
        .send({ amount: 1000, type: "expense", category: "Food" });

      expect(res.statusCode).toBe(403);
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/records")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: 1000 });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /api/records", () => {
    it("should return records for analyst", async () => {
      const res = await request(app)
        .get("/api/records")
        .set("Authorization", `Bearer ${analystToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should support filtering by type", async () => {
      const res = await request(app)
        .get("/api/records?type=income")
        .set("Authorization", `Bearer ${analystToken}`);

      expect(res.statusCode).toBe(200);
      res.body.data.forEach((r) => expect(r.type).toBe("income"));
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/records?page=1&limit=2")
        .set("Authorization", `Bearer ${analystToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("pages");
      expect(res.body).toHaveProperty("total");
    });
  });

  describe("PATCH /api/records/:id", () => {
    it("should update a record", async () => {
      const res = await request(app)
        .patch(`/api/records/${recordId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ amount: 6000, notes: "Updated salary" });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.amount).toBe(6000);
    });
  });

  describe("DELETE /api/records/:id", () => {
    it("should soft delete a record", async () => {
      const res = await request(app)
        .delete(`/api/records/${recordId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for already deleted record", async () => {
      const res = await request(app)
        .get(`/api/records/${recordId}`)
        .set("Authorization", `Bearer ${analystToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
