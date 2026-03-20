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

describe("PUT /api/users/:id", () => {
  let app;

  beforeEach(() => {
    app = createApp({
      authenticateJwt: createAuthMiddleware({ jwtSecret: SECRET }),
    });
  });

  it("Should return 200 When user exists", async () => {
    const created = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        name: "Grace",
        email: "grace@spsgroup.com.br",
        type: "user",
        password: "x",
      });

    const id = created.body.user.id;

    const res = await request(app)
      .put(`/api/users/${id}`)
      .set("Authorization", `Bearer ${createToken()}`)
      .send({ name: "Grace Updated" });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe("Grace Updated");
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("Should return 404 When id does not exist", async () => {
    const res = await request(app)
      .put("/api/users/00000000-0000-0000-0000-000000000099")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({ name: "Nobody" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("user_not_found");
  });

  it("Should return 409 When email is taken by another user", async () => {
    await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        name: "h1",
        email: "h1@spsgroup.com.br",
        type: "user",
        password: "1",
      });
    const h2 = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        name: "h2",
        email: "h2@spsgroup.com.br",
        type: "user",
        password: "1",
      });

    const res = await request(app)
      .put(`/api/users/${h2.body.user.id}`)
      .set("Authorization", `Bearer ${createToken()}`)
      .send({ email: "h1@spsgroup.com.br" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("email_already_exists");
  });
});

describe("DELETE /api/users/:id", () => {
  let app;

  beforeEach(() => {
    app = createApp({
      authenticateJwt: createAuthMiddleware({ jwtSecret: SECRET }),
    });
  });

  it("Should return 204 When user exists", async () => {
    const created = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${createToken()}`)
      .send({
        name: "Ivy",
        email: "ivy@spsgroup.com.br",
        type: "user",
        password: "1",
      });

    const res = await request(app)
      .delete(`/api/users/${created.body.user.id}`)
      .set("Authorization", `Bearer ${createToken()}`);

    expect(res.status).toBe(204);
  });

  it("Should return 404 When id does not exist", async () => {
    const res = await request(app)
      .delete("/api/users/00000000-0000-0000-0000-000000000099")
      .set("Authorization", `Bearer ${createToken()}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("user_not_found");
  });
});
