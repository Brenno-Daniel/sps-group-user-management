const {
  EmailAlreadyExistsError,
} = require("../repositories/inMemoryUserRepository");
const { ValidationError } = require("../services/userService");

function createUserController(userService) {
  return {
    list: (req, res, next) => {
      try {
        const users = userService.list();
        res.json({ users });
      } catch (err) {
        next(err);
      }
    },

    create: (req, res, next) => {
      try {
        const user = userService.create(req.body);
        res.status(201).json({ user });
      } catch (err) {
        if (err instanceof EmailAlreadyExistsError) {
          return res.status(409).json({ error: "email_already_exists" });
        }
        if (err instanceof ValidationError) {
          return res.status(400).json({ error: "validation_error" });
        }
        next(err);
      }
    },
  };
}

module.exports = { createUserController };
