import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "./app.js";
import { createAuthMiddleware } from "./middlewares/authMiddleware.js";
import { ADMIN_USER_ID } from "./repositories/inMemoryUserRepository.js";

const SECRET = "integration-test-secret";

function createToken() {
  return jwt.sign(
    {
      sub: ADMIN_USER_ID,
      email: "admin@spsgroup.com.br",
      type: "admin",
    },
    SECRET,
    { expiresIn: "1h" },
  );
}

describe("GET /api/users", () => {
  let app;

  beforeEach(() => {
    app = createApp({
      authenticateJwt: createAuthMiddleware({ jwtSecret: SECRET }),
    });
  });

  it("Should return user list When JWT is valid", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${createToken()}`);

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

describe("POST /api/users", () => {
  let app;

  beforeEach(() => {
    app = createApp({
      authenticateJwt: createAuthMiddleware({ jwtSecret: SECRET }),
    });
  });

  it("Should return 201 When body is valid and email is unique", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        name: "Carol",
        email: "carol@spsgroup.com.br",
        type: "user",
        password: "p455w0rd",
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({
      name: "Carol",
      email: "carol@spsgroup.com.br",
      type: "user",
    });
    expect(res.body.user.id).toBeDefined();
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("Should return 409 When email already exists", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        name: "Dup",
        email: "admin@spsgroup.com.br",
        type: "user",
        password: "x",
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("email_already_exists");
  });

  it("Should return 400 When a required field is missing", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        name: "Incomplete",
        email: "incomplete@spsgroup.com.br",
        type: "user",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("validation_error");
  });
});
