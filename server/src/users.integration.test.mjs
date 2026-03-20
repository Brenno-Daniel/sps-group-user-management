import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "./app.js";
import { createAuthMiddleware } from "./middlewares/authMiddleware.js";
import { ADMIN_USER_ID } from "./repositories/inMemoryUserRepository.js";

const SECRET = "integration-test-secret";

describe("GET /api/users", () => {
  let app;

  beforeEach(() => {
    app = createApp({
      authenticateJwt: createAuthMiddleware({ jwtSecret: SECRET }),
    });
  });

  it("Should return user list When JWT is valid", async () => {
    const token = jwt.sign(
      {
        sub: ADMIN_USER_ID,
        email: "admin@spsgroup.com.br",
        type: "admin",
      },
      SECRET,
      { expiresIn: "1h" },
    );

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBeGreaterThanOrEqual(1);
    expect(res.body.users[0]).not.toHaveProperty("password");
    expect(res.body.users[0].email).toBe("admin@spsgroup.com.br");
  });

  it("Should return 401 When Authorization header is missing", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });
});
