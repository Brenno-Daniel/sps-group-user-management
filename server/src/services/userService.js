class ValidationError extends Error {
  constructor() {
    super("Validation failed");
    this.name = "ValidationError";
    this.code = "VALIDATION_ERROR";
  }
}

class UserService {
  constructor(userRepository) {
    this._users = userRepository;
  }

  list() {
    return this._users.findAll().map((user) => this._toPublicUser(user));
  }

  create(payload) {
    const { name, email, type, password } = payload ?? {};
    this._assertCreateFields({ name, email, type, password });
    const user = this._users.create({ name, email, type, password });
    return this._toPublicUser(user);
  }

  updateById(id, payload) {
    const { name, email, type, password } = payload ?? {};
    this._assertUpdatePayload({ name, email, type, password });
    const user = this._users.update(id, { name, email, type, password });
    return this._toPublicUser(user);
  }

  removeById(id) {
    this._users.delete(id);
  }

  _assertUpdatePayload({ name, email, type, password }) {
    const entries = [
      ["name", name],
      ["email", email],
      ["type", type],
      ["password", password],
    ];
    const provided = entries.filter(([, v]) => v !== undefined);
    if (provided.length === 0) {
      throw new ValidationError();
    }
    for (const [, value] of provided) {
      if (String(value).trim() === "") {
        throw new ValidationError();
      }
    }
  }

  _assertCreateFields({ name, email, type, password }) {
    const values = [name, email, type, password];
    const invalid = values.some(
      (v) => v === undefined || v === null || String(v).trim() === "",
    );
    if (invalid) {
      throw new ValidationError();
    }
  }

  _toPublicUser(user) {
    const copy = { ...user };
    delete copy.password;
    return copy;
  }
}

module.exports = { UserService, ValidationError };
