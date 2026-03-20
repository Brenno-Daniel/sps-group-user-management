import { describe, it, expect, beforeEach } from "vitest";
import {
  InMemoryUserRepository,
  EmailAlreadyExistsError,
} from "../repositories/inMemoryUserRepository.js";
import { UserService, ValidationError } from "./userService.js";

describe("UserService.list", () => {
  let repository;
  let userService;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    userService = new UserService(repository);
  });

  it("Should return users without password When repository only has seeded admin", () => {
    const users = userService.list();

    expect(users).toHaveLength(1);
    expect(users[0]).not.toHaveProperty("password");
    expect(users[0].email).toBe("admin@spsgroup.com.br");
    expect(users[0].type).toBe("admin");
  });

  it("Should return all entries without passwords When repository has multiple users", () => {
    repository.create({
      name: "Alice",
      email: "alice@spsgroup.com.br",
      type: "user",
      password: "secret",
    });

    const users = userService.list();

    expect(users).toHaveLength(2);
    users.forEach((u) => {
      expect(u).not.toHaveProperty("password");
    });
    expect(users.map((u) => u.email).sort()).toEqual([
      "admin@spsgroup.com.br",
      "alice@spsgroup.com.br",
    ]);
  });
});

describe("UserService.create", () => {
  let repository;
  let userService;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    userService = new UserService(repository);
  });

  it("Should return new user without password When payload is valid and email is unique", () => {
    const created = userService.create({
      name: "Bob",
      email: "bob@spsgroup.com.br",
      type: "user",
      password: "secret",
    });

    expect(created).toMatchObject({
      name: "Bob",
      email: "bob@spsgroup.com.br",
      type: "user",
    });
    expect(created.id).toBeDefined();
    expect(created).not.toHaveProperty("password");
  });

  it("Should reject When email is already registered", () => {
    expect(() =>
      userService.create({
        name: "X",
        email: "admin@spsgroup.com.br",
        type: "user",
        password: "x",
      }),
    ).toThrow(EmailAlreadyExistsError);
  });

  it("Should reject When same email matches with different casing", () => {
    expect(() =>
      userService.create({
        name: "X",
        email: "ADMIN@SPSGROUP.COM.BR",
        type: "user",
        password: "x",
      }),
    ).toThrow(EmailAlreadyExistsError);
  });

  it("Should reject When a required field is missing", () => {
    expect(() =>
      userService.create({
        name: "X",
        email: "new@spsgroup.com.br",
        type: "user",
      }),
    ).toThrow(ValidationError);
  });
});
