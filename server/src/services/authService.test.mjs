import { describe, it, expect, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import {
  InMemoryUserRepository,
  ADMIN_USER_ID,
} from "../repositories/inMemoryUserRepository.js";
import { AuthService, InvalidCredentialsError } from "./authService.js";

const JWT_SECRET = "test-jwt-secret";

describe("AuthService.login", () => {
  let repository;
  let authService;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    authService = new AuthService(repository, {
      jwtSecret: JWT_SECRET,
      expiresIn: "1h",
    });
  });

  it("Should return JWT When credentials match seeded admin", () => {
    const email = "admin@spsgroup.com.br";
    const password = "1234";

    const result = authService.login({ email, password });

    expect(result.token).toBeDefined();
    expect(result.user).toEqual({
      id: ADMIN_USER_ID,
      name: "admin",
      email: "admin@spsgroup.com.br",
      type: "admin",
    });

    const payload = jwt.verify(result.token, JWT_SECRET);
    expect(payload.sub).toBe(ADMIN_USER_ID);
    expect(payload.email).toBe("admin@spsgroup.com.br");
    expect(payload.type).toBe("admin");
  });

  it("Should return JWT When email casing differs but matches seeded admin", () => {
    const result = authService.login({
      email: "Admin@SPSGROUP.com.br",
      password: "1234",
    });

    expect(result.token).toBeDefined();
    const payload = jwt.verify(result.token, JWT_SECRET);
    expect(payload.sub).toBe(ADMIN_USER_ID);
  });

  it("Should reject When password is incorrect", () => {
    expect(() =>
      authService.login({
        email: "admin@spsgroup.com.br",
        password: "wrong-password",
      }),
    ).toThrow(InvalidCredentialsError);
  });

  it("Should reject When email is not registered", () => {
    expect(() =>
      authService.login({
        email: "unknown@spsgroup.com.br",
        password: "1234",
      }),
    ).toThrow(InvalidCredentialsError);
  });
});
