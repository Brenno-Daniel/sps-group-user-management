import { describe, it, expect } from "vitest";
import {
  validateCreateUserForm,
  validateEditUserForm,
} from "./userFormValidation";

describe("validateCreateUserForm", () => {
  it("Should accept When all fields are valid", () => {
    const result = validateCreateUserForm({
      name: "Maria",
      email: "maria@example.com",
      type: "user",
      password: "secret",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("Should reject When email format is invalid", () => {
    const result = validateCreateUserForm({
      name: "Maria",
      email: "not-an-email",
      type: "user",
      password: "secret",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("Should reject When required fields are empty", () => {
    const result = validateCreateUserForm({
      name: "",
      email: "",
      type: "",
      password: "",
    });

    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(0);
  });
});

describe("validateEditUserForm", () => {
  it("Should accept When password is empty and other fields are valid", () => {
    const result = validateEditUserForm({
      name: "João",
      email: "joao@example.com",
      type: "admin",
      password: "",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("Should reject When optional password is too short", () => {
    const result = validateEditUserForm({
      name: "João",
      email: "joao@example.com",
      type: "admin",
      password: "ab",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.password).toBeDefined();
  });
});
