import { describe, it, expect, beforeEach } from "vitest";
import {
  InMemoryUserRepository,
  EmailAlreadyExistsError,
  UserNotFoundError,
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

describe("UserService.updateById", () => {
  let repository;
  let userService;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    userService = new UserService(repository);
  });

  it("Should return updated user without password When id exists and payload is valid", () => {
    const created = userService.create({
      name: "Dan",
      email: "dan@spsgroup.com.br",
      type: "user",
      password: "p",
    });

    const updated = userService.updateById(created.id, { name: "Daniel" });

    expect(updated.name).toBe("Daniel");
    expect(updated.email).toBe("dan@spsgroup.com.br");
    expect(updated).not.toHaveProperty("password");
  });

  it("Should reject When user id does not exist", () => {
    expect(() =>
      userService.updateById("00000000-0000-0000-0000-000000000099", {
        name: "Ghost",
      }),
    ).toThrow(UserNotFoundError);
  });

  it("Should reject When new email is already taken by another user", () => {
    const first = userService.create({
      name: "a",
      email: "a-upd@spsgroup.com.br",
      type: "user",
      password: "1",
    });
    userService.create({
      name: "b",
      email: "b-upd@spsgroup.com.br",
      type: "user",
      password: "1",
    });

    expect(() =>
      userService.updateById(first.id, { email: "b-upd@spsgroup.com.br" }),
    ).toThrow(EmailAlreadyExistsError);
  });

  it("Should reject When no fields are provided", () => {
    const created = userService.create({
      name: "Eve",
      email: "eve@spsgroup.com.br",
      type: "user",
      password: "1",
    });

    expect(() => userService.updateById(created.id, {})).toThrow(ValidationError);
  });
});

describe("UserService.removeById", () => {
  let repository;
  let userService;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    userService = new UserService(repository);
  });

  it("Should remove user When id exists", () => {
    const created = userService.create({
      name: "Frank",
      email: "frank@spsgroup.com.br",
      type: "user",
      password: "1",
    });

    userService.removeById(created.id);

    expect(userService.list().find((u) => u.id === created.id)).toBeUndefined();
  });

  it("Should reject When id does not exist", () => {
    expect(() =>
      userService.removeById("00000000-0000-0000-0000-000000000099"),
    ).toThrow(UserNotFoundError);
  });
});
