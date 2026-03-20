const { randomUUID } = require("crypto");

const ADMIN_USER_ID = "00000000-0000-0000-0000-000000000001";

const SEED_ADMIN = {
  id: ADMIN_USER_ID,
  name: "admin",
  email: "admin@spsgroup.com.br",
  type: "admin",
  password: "1234",
};

class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Email already exists");
    this.name = "EmailAlreadyExistsError";
    this.code = "EMAIL_ALREADY_EXISTS";
  }
}

class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
    this.name = "UserNotFoundError";
    this.code = "USER_NOT_FOUND";
  }
}

class InMemoryUserRepository {
  constructor() {
    /** @type {Map<string, object>} */
    this._byId = new Map();
    /** @type {Map<string, string>} */
    this._emailToId = new Map();
    this._seedAdmin();
  }

  _seedAdmin() {
    const user = { ...SEED_ADMIN };
    this._byId.set(user.id, user);
    this._emailToId.set(this._normalizeEmail(user.email), user.id);
  }

  _normalizeEmail(email) {
    return String(email).trim().toLowerCase();
  }

  _clone(user) {
    return { ...user };
  }

  findAll() {
    return [...this._byId.values()].map((u) => this._clone(u));
  }

  findById(id) {
    const user = this._byId.get(id);
    return user ? this._clone(user) : undefined;
  }

  findByEmail(email) {
    const id = this._emailToId.get(this._normalizeEmail(email));
    if (!id) {
      return undefined;
    }
    return this._clone(this._byId.get(id));
  }

  create({ name, email, type, password }) {
    const normalizedEmail = this._normalizeEmail(email);
    if (this._emailToId.has(normalizedEmail)) {
      throw new EmailAlreadyExistsError();
    }
    const id = randomUUID();
    const user = {
      id,
      name,
      email: normalizedEmail,
      type,
      password,
    };
    this._byId.set(id, user);
    this._emailToId.set(normalizedEmail, id);
    return this._clone(user);
  }

  update(id, { name, email, type, password }) {
    const existing = this._byId.get(id);
    if (!existing) {
      throw new UserNotFoundError();
    }
    const nextEmail = email !== undefined ? this._normalizeEmail(email) : existing.email;
    if (nextEmail !== existing.email && this._emailToId.has(nextEmail)) {
      throw new EmailAlreadyExistsError();
    }
    if (nextEmail !== existing.email) {
      this._emailToId.delete(existing.email);
      this._emailToId.set(nextEmail, id);
    }
    const updated = {
      ...existing,
      name: name !== undefined ? name : existing.name,
      email: nextEmail,
      type: type !== undefined ? type : existing.type,
      password: password !== undefined ? password : existing.password,
    };
    this._byId.set(id, updated);
    return this._clone(updated);
  }

  delete(id) {
    const existing = this._byId.get(id);
    if (!existing) {
      throw new UserNotFoundError();
    }
    this._byId.delete(id);
    this._emailToId.delete(existing.email);
  }
}

module.exports = {
  InMemoryUserRepository,
  ADMIN_USER_ID,
  EmailAlreadyExistsError,
  UserNotFoundError,
};
