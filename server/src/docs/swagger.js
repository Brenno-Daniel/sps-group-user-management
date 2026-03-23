const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const OPENAPI_VERSION = "3.0.0";

/**
 * OpenAPI `servers` list. Set PUBLIC_BASE_URL on deployed hosts (e.g. Render) so
 * Swagger UI "Try it out" uses HTTPS and the public host instead of localhost.
 * Example: PUBLIC_BASE_URL=https://sps-group-user-management-server.onrender.com
 */
function buildServers() {
  const port = process.env.PORT || 3000;
  const localUrl = `http://localhost:${port}`;
  const publicBase = (process.env.PUBLIC_BASE_URL || "").trim().replace(/\/$/, "");

  const servers = [];
  if (publicBase) {
    servers.push({
      url: publicBase,
      description: "Deployed API",
    });
  }
  servers.push({
    url: localUrl,
    description: "Local development",
  });
  return servers;
}

function buildSwaggerSpec() {
  return swaggerJsdoc({
    definition: {
      openapi: OPENAPI_VERSION,
      info: {
        title: "SPS User Management API",
        version: "1.0.0",
        description: [
          "REST API for user CRUD with JWT authentication (technical assessment).",
          "",
          "Flow: call `POST /api/auth/login` with email and password to receive a JWT, then send `Authorization: Bearer <token>` on protected routes.",
          "Interactive docs: `GET /api-docs` when the server is running.",
        ].join("\n"),
      },
      servers: buildServers(),
      tags: [
        { name: "Health", description: "Service availability" },
        { name: "Auth", description: "Authentication" },
        { name: "Users", description: "User management" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: [path.join(__dirname, "..", "routes.js")],
  });
}

module.exports = { buildSwaggerSpec };
