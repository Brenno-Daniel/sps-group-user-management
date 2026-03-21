const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const { buildSwaggerSpec } = require("./docs/swagger");
const { createRouter } = require("./routes");
const { InMemoryUserRepository } = require("./repositories/inMemoryUserRepository");
const { UserService } = require("./services/userService");
const { AuthService } = require("./services/authService");
const { createUserController } = require("./controllers/userController");
const { createAuthController } = require("./controllers/authController");
const { createAuthMiddleware } = require("./middlewares/authMiddleware");

function createApp(options = {}) {
  const repository = options.userRepository ?? new InMemoryUserRepository();
  const userService = options.userService ?? new UserService(repository);
  const authService =
    options.authService ?? new AuthService(repository);
  const userController = options.userController ?? createUserController(userService);
  const authController = options.authController ?? createAuthController(authService);
  const authenticateJwt =
    options.authenticateJwt ?? createAuthMiddleware();

  const app = express();
  app.use(cors());
  app.use(express.json());

  const swaggerSpec = buildSwaggerSpec();
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(
    createRouter({
      authController,
      userController,
      authenticateJwt,
    }),
  );

  return app;
}

module.exports = { createApp };
