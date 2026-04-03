const request = require("supertest");
const app = require("../../app");

describe("Auth Routes", () => {
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "123456",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user and return a token", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.role).toBe("viewer");
    });

    it("should return 409 if email is already registered", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "missing@example.com" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login and return a token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("token");
    });

    it("should return 401 for wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 for non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "ghost@example.com",
        password: "123456",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 if fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "testuser@example.com" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
