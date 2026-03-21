import { describe, it, expect } from "vitest";
import { getUserTypeLabel } from "./userDisplay";

describe("getUserTypeLabel", () => {
  it("Should return Portuguese label When type is known", () => {
    expect(getUserTypeLabel("admin")).toBe("Administrador");
    expect(getUserTypeLabel("user")).toBe("Usuário");
  });

  it("Should return raw value When type is unknown", () => {
    expect(getUserTypeLabel("custom")).toBe("custom");
  });
});
