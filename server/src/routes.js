const { Router } = require("express");

const routes = Router();

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Plain text greeting
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello World!
 */
routes.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = routes;
