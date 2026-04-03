const request = require("supertest");
const app = require("../../app");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

describe("User Routes", () => {
  let adminToken;
  let viewerToken;
  let targetUserId;

  beforeAll(async () => {
    // Create an admin user directly in DB
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });
    adminToken = signToken(admin._id, admin.role);

    // Create a viewer user
    const viewer = await User.create({
      name: "Viewer User",
      email: "viewer@example.com",
      password: "123456",
      role: "viewer",
    });
    viewerToken = signToken(viewer._id, viewer.role);
    targetUserId = viewer._id;
  });

  describe("GET /api/users", () => {
    it("should return all users for admin", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 403 for non-admin", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${viewerToken}`);

      expect(res.statusCode).toBe(403);
    });

    it("should return 401 with no token", async () => {
      const res = await request(app).get("/api/users");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("PATCH /api/users/:id/role", () => {
    it("should update user role", async () => {
      const res = await request(app)
        .patch(`/api/users/${targetUserId}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "analyst" });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.role).toBe("analyst");
    });

    it("should return 400 for invalid role", async () => {
      const res = await request(app)
        .patch(`/api/users/${targetUserId}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "superuser" });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("PATCH /api/users/:id/status", () => {
    it("should deactivate a user", async () => {
      const res = await request(app)
        .patch(`/api/users/${targetUserId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.isActive).toBe(false);
    });

    it("should return 400 if isActive is missing", async () => {
      const res = await request(app)
        .patch(`/api/users/${targetUserId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });
});
