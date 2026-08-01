import request from "supertest";
import app from "../src/app.js";
import "./setup.js";

describe("Auth API", () => {
  const user = { name: "Test User", email: "test@example.com", password: "password123" };

  it("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.user.password).toBeUndefined(); // password must never be returned
  });

  it("rejects duplicate email registration", async () => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app).post("/api/auth/login").send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    await request(app).post("/api/auth/register").send(user);
    const res = await request(app).post("/api/auth/login").send({ email: user.email, password: "wrongpass" });
    expect(res.status).toBe(401);
  });

  it("blocks profile access without a token", async () => {
    const res = await request(app).get("/api/auth/profile");
    expect(res.status).toBe(401);
  });
});
