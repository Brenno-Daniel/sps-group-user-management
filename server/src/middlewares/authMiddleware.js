const jwt = require("jsonwebtoken");

const JWT_ALGORITHM = "HS256";

function createAuthMiddleware(options = {}) {
  const secret = options.jwtSecret ?? process.env.JWT_SECRET;

  function authenticateJwt(req, res, next) {
    if (!secret) {
      return res.status(500).json({ error: "jwt_secret_not_configured" });
    }

    const header = req.headers.authorization;
    if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "missing_or_malformed_token" });
    }

    const raw = header.slice("Bearer ".length).trim();
    if (!raw) {
      return res.status(401).json({ error: "missing_or_malformed_token" });
    }

    try {
      const payload = jwt.verify(raw, secret, { algorithms: [JWT_ALGORITHM] });
      req.user = {
        id: payload.sub,
        email: payload.email,
        type: payload.type,
      };
      next();
    } catch {
      return res.status(401).json({ error: "invalid_or_expired_token" });
    }
  }

  return authenticateJwt;
}

module.exports = { createAuthMiddleware };
