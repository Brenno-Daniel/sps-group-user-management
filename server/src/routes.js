const { Router } = require("express");

function createRouter({ userController, authenticateJwt }) {
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

  /**
   * @openapi
   * /api/me:
   *   get:
   *     summary: Current authenticated user (JWT)
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User derived from JWT claims
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id: { type: string }
   *                     email: { type: string }
   *                     type: { type: string }
   *       401:
   *         description: Missing or invalid token
   */
  routes.get("/api/me", authenticateJwt, (req, res) => {
    res.json({ user: req.user });
  });

  /**
   * @openapi
   * /api/users:
   *   get:
   *     summary: List all users
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Users without passwords
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id: { type: string }
   *                       name: { type: string }
   *                       email: { type: string }
   *                       type: { type: string }
   *       401:
   *         description: Missing or invalid token
   */
  routes.get("/api/users", authenticateJwt, userController.list);

  return routes;
}

module.exports = { createRouter };
