const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const OPENAPI_VERSION = "3.0.0";

function buildSwaggerSpec() {
  return swaggerJsdoc({
    definition: {
      openapi: OPENAPI_VERSION,
      info: {
        title: "SPS User Management API",
        version: "1.0.0",
        description:
          "REST API for user CRUD with JWT authentication (technical assessment).",
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: "Local development",
        },
      ],
      tags: [
        { name: "Health", description: "Service availability" },
        { name: "Auth", description: "Authentication" },
        { name: "Users", description: "User management" },
      ],
    },
    apis: [path.join(__dirname, "..", "routes.js")],
  });
}

module.exports = { buildSwaggerSpec };
