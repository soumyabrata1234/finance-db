const request = require("supertest");
const app = require("../../app");
const User = require("../models/User");
const FinancialRecord = require("../models/FinancialRecord");
const { signToken } = require("../utils/jwt");

describe("Dashboard Routes", () => {
  let analystToken;

  beforeAll(async () => {
    const analyst = await User.create({
      name: "Dash Analyst",
      email: "dashanalyst@example.com",
      password: "123456",
      role: "analyst",
    });
    analystToken = signToken(analyst._id, analyst.role);

    // Seed some records for aggregation
    await FinancialRecord.insertMany([
      { amount: 10000, type: "income",  category: "Salary",  date: "2026-03-01", createdBy: analyst._id },
      { amount: 3000,  type: "expense", category: "Rent",    date: "2026-03-05", createdBy: analyst._id },
      { amount: 5000,  type: "income",  category: "Freelance", date: "2026-04-01", createdBy: analyst._id },
      { amount: 1000,  type: "expense", category: "Food",    date: "2026-04-10", createdBy: analyst._id },
    ]);
  });

  it("GET /api/dashboard/summary should return totals", async () => {
    const res = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${analystToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("totalIncome");
    expect(res.body.data).toHaveProperty("totalExpenses");
    expect(res.body.data).toHaveProperty("netBalance");
    expect(res.body.data.totalIncome).toBe(15000);
    expect(res.body.data.totalExpenses).toBe(4000);
    expect(res.body.data.netBalance).toBe(11000);
  });

  it("GET /api/dashboard/by-category should return category breakdown", async () => {
    const res = await request(app)
      .get("/api/dashboard/by-category")
      .set("Authorization", `Bearer ${analystToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("category");
    expect(res.body.data[0]).toHaveProperty("total");
  });

  it("GET /api/dashboard/trends should return monthly trends", async () => {
    const res = await request(app)
      .get("/api/dashboard/trends")
      .set("Authorization", `Bearer ${analystToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("period");
    expect(res.body.data[0]).toHaveProperty("net");
  });

  it("GET /api/dashboard/recent should return recent records", async () => {
    const res = await request(app)
      .get("/api/dashboard/recent")
      .set("Authorization", `Bearer ${analystToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should return 403 for viewer", async () => {
    const viewer = await User.create({
      name: "Viewer",
      email: "dashviewer@example.com",
      password: "123456",
      role: "viewer",
    });
    const viewerToken = signToken(viewer._id, viewer.role);

    const res = await request(app)
      .get("/api/dashboard/summary")
      .set("Authorization", `Bearer ${viewerToken}`);

    expect(res.statusCode).toBe(403);
  });
});
