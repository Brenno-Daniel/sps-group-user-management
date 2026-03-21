import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../api/client", () => ({
  setAuthToken: vi.fn(),
}));

vi.mock("../services/userApi", () => ({
  loginRequest: vi.fn(),
}));

import { setAuthToken } from "../api/client";
import { loginRequest } from "../services/userApi";

function Probe() {
  const { isAuthenticated, user, token, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? "yes" : "no"}</span>
      <span data-testid="token">{token ?? ""}</span>
      <span data-testid="email">{user?.email ?? ""}</span>
      <button
        type="button"
        onClick={() =>
          login({ email: "admin@spsgroup.com.br", password: "1234" })
        }
      >
        Entrar
      </button>
      <button type="button" onClick={() => logout()}>
        Sair
      </button>
    </div>
  );
}

function storageMock() {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => {
      store[k] = String(v);
    },
    removeItem: (k) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
  };
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const s = storageMock();
    Object.defineProperty(window, "localStorage", {
      value: s,
      writable: true,
    });
    s.clear();
  });

  it("Should persist token and user in localStorage When login succeeds", async () => {
    const user = {
      id: "1",
      name: "admin",
      email: "admin@spsgroup.com.br",
      type: "admin",
    };
    vi.mocked(loginRequest).mockResolvedValue({
      token: "jwt-token",
      user,
    });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth")).toHaveTextContent("no");

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("auth")).toHaveTextContent("yes");
    });

    expect(screen.getByTestId("token")).toHaveTextContent("jwt-token");
    expect(screen.getByTestId("email")).toHaveTextContent("admin@spsgroup.com.br");
    expect(localStorage.getItem("sps_auth_token")).toBe("jwt-token");
    expect(JSON.parse(localStorage.getItem("sps_auth_user"))).toEqual(user);
    expect(vi.mocked(setAuthToken)).toHaveBeenCalledWith("jwt-token");
  });

  it("Should clear auth state When logout is called", async () => {
    vi.mocked(loginRequest).mockResolvedValue({
      token: "t",
      user: { id: "1", email: "a@b.com", name: "A", type: "user" },
    });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    });
    await waitFor(() =>
      expect(screen.getByTestId("auth")).toHaveTextContent("yes"),
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Sair" }));
    });

    expect(screen.getByTestId("auth")).toHaveTextContent("no");
    expect(screen.getByTestId("token")).toHaveTextContent("");
    expect(localStorage.getItem("sps_auth_token")).toBeNull();
    expect(localStorage.getItem("sps_auth_user")).toBeNull();
  });
});
