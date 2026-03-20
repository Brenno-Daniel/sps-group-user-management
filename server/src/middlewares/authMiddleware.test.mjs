import { describe, it, expect, beforeEach, vi } from "vitest";
import jwt from "jsonwebtoken";
import { createAuthMiddleware } from "./authMiddleware.js";

const SECRET = "middleware-test-secret";

describe("createAuthMiddleware", () => {
  let authenticateJwt;

  beforeEach(() => {
    authenticateJwt = createAuthMiddleware({ jwtSecret: SECRET });
  });

  it("Should call next When Bearer token is valid", () => {
    const token = jwt.sign(
      { sub: "user-1", email: "a@test.com", type: "admin" },
      SECRET,
      { expiresIn: "1h" },
    );

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    authenticateJwt(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(req.user).toEqual({
      id: "user-1",
      email: "a@test.com",
      type: "admin",
    });
  });

  it("Should respond 401 When Authorization header is missing", () => {
    const req = { headers: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    authenticateJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "missing_or_malformed_token",
    });
  });

  it("Should respond 401 When Bearer token is not a valid JWT", () => {
    const req = { headers: { authorization: "Bearer not-a-jwt" } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    authenticateJwt(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid_or_expired_token",
    });
  });

  it("Should respond 401 When Bearer prefix is present but token is empty", () => {
    const req = { headers: { authorization: "Bearer " } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    authenticateJwt(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "missing_or_malformed_token",
    });
  });
});
