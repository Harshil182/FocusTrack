import request from "supertest";
import app from "../src/app.js";
import "./setup.js";

// Helper: registers a user and returns their auth token.
async function getAuthToken() {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Tracker", email: "tracker@example.com", password: "password123" });
  return res.body.token;
}

describe("Tracking API", () => {
  it("syncs tracking entries and accumulates duration for repeated syncs", async () => {
    const token = await getAuthToken();
    const date = new Date().toISOString().slice(0, 10);

    await request(app)
      .post("/api/tracking/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({ entries: [{ domain: "github.com", date, durationSeconds: 120 }] });

    const res = await request(app)
      .post("/api/tracking/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({ entries: [{ domain: "github.com", date, durationSeconds: 60 }] });

    expect(res.status).toBe(200);
    expect(res.body.data[0].durationSeconds).toBe(180); // 120 + 60 accumulated
  });

  it("rejects sync requests without authentication", async () => {
    const res = await request(app).post("/api/tracking/sync").send({ entries: [] });
    expect(res.status).toBe(401);
  });
});
