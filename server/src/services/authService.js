const jwt = require("jsonwebtoken");

class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
    this.code = "INVALID_CREDENTIALS";
  }
}

class AuthService {
  constructor(userRepository, options = {}) {
    this._users = userRepository;
    this._secret = options.jwtSecret ?? process.env.JWT_SECRET;
    this._expiresIn = options.expiresIn ?? "1d";
  }

  login({ email, password }) {
    if (!this._secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const user = this._users.findByEmail(email);
    if (!user || user.password !== password) {
      throw new InvalidCredentialsError();
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, type: user.type },
      this._secret,
      { expiresIn: this._expiresIn },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    };
  }
}

module.exports = { AuthService, InvalidCredentialsError };
