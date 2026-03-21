const { InvalidCredentialsError } = require("../services/authService");

function createAuthController(authService) {
  return {
    login: (req, res, next) => {
      try {
        const result = authService.login(req.body);
        res.status(200).json(result);
      } catch (err) {
        if (
          err instanceof InvalidCredentialsError ||
          err?.code === "INVALID_CREDENTIALS"
        ) {
          return res.status(401).json({ error: "invalid_credentials" });
        }
        next(err);
      }
    },
  };
}

module.exports = { createAuthController };
