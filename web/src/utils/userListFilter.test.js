import { describe, it, expect } from "vitest";
import { filterUsersBySearchQuery } from "./userListFilter";

const sample = [
  {
    id: "1",
    name: "Admin Silva",
    email: "admin@spsgroup.com.br",
    type: "admin",
  },
  {
    id: "2",
    name: "Brenno Costa",
    email: "brenno@sps.com",
    type: "user",
  },
  {
    id: "3",
    name: "Maria",
    email: "maria@example.com",
    type: "user",
  },
];

describe("filterUsersBySearchQuery", () => {
  it("Should return all users When query is empty", () => {
    const result = filterUsersBySearchQuery(sample, "");
    expect(result).toHaveLength(3);
  });

  it("Should return all users When query is only whitespace", () => {
    const result = filterUsersBySearchQuery(sample, "   ");
    expect(result).toHaveLength(3);
  });

  it("Should match by partial name When query matches nome", () => {
    const result = filterUsersBySearchQuery(sample, "bren");
    expect(result.map((u) => u.id)).toEqual(["2"]);
  });

  it("Should match by e-mail case-insensitively When query matches email", () => {
    const result = filterUsersBySearchQuery(sample, "SPSGROUP");
    expect(result.map((u) => u.id)).toEqual(["1"]);
  });

  it("Should match by type label When query is administrador", () => {
    const result = filterUsersBySearchQuery(sample, "administra");
    expect(result.some((u) => u.id === "1")).toBe(true);
  });

  it("Should match by type value When query is admin", () => {
    const result = filterUsersBySearchQuery(sample, "admin");
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.map((u) => u.id)).toContain("1");
  });

  it("Should return empty array When no user matches", () => {
    const result = filterUsersBySearchQuery(sample, "zzz-inexistente");
    expect(result).toEqual([]);
  });
});
