import { api } from "../api/client";

export async function loginRequest({ email, password }) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get("/api/users");
  return data.users;
}

export async function createUser(payload) {
  const { data } = await api.post("/api/users", payload);
  return data.user;
}

export async function updateUser(id, payload) {
  const { data } = await api.put(`/api/users/${id}`, payload);
  return data.user;
}

export async function deleteUser(id) {
  await api.delete(`/api/users/${id}`);
}
