import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

const mockUseAuth = vi.fn();

vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("Should redirect to login When user is not authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/login" element={<div>Página de login</div>} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <div>Lista de usuários</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Página de login")).toBeInTheDocument();
    expect(screen.queryByText("Lista de usuários")).not.toBeInTheDocument();
  });

  it("Should render children When user is authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter initialEntries={["/users"]}>
        <Routes>
          <Route path="/login" element={<div>Página de login</div>} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <div>Lista de usuários</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Lista de usuários")).toBeInTheDocument();
    expect(screen.queryByText("Página de login")).not.toBeInTheDocument();
  });
});
