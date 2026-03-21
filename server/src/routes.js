const { Router } = require("express");

function createRouter({ authController, userController, authenticateJwt }) {
  const routes = Router();

  /**
   * @openapi
   * /api/auth/login:
   *   post:
   *     summary: Sign in and obtain JWT
   *     tags:
   *       - Auth
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: JWT and public user profile
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                 user:
   *                   type: object
   *                   properties:
   *                     id: { type: string }
   *                     name: { type: string }
   *                     email: { type: string }
   *                     type: { type: string }
   *       401:
   *         description: Invalid email or password
   */
  routes.post("/api/auth/login", authController.login);

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
   *   post:
   *     summary: Create user
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - type
   *               - password
   *             properties:
   *               name: { type: string }
   *               email: { type: string }
   *               type: { type: string }
   *               password: { type: string }
   *     responses:
   *       201:
   *         description: Created user without password
   *       400:
   *         description: Validation error
   *       409:
   *         description: Email already registered
   *       401:
   *         description: Missing or invalid token
   */
  routes.get("/api/users", authenticateJwt, userController.list);
  routes.post("/api/users", authenticateJwt, userController.create);

  /**
   * @openapi
   * /api/users/{id}:
   *   put:
   *     summary: Update user
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             minProperties: 1
   *             properties:
   *               name: { type: string }
   *               email: { type: string }
   *               type: { type: string }
   *               password: { type: string }
   *     responses:
   *       200:
   *         description: Updated user without password
   *       400:
   *         description: Validation error
   *       404:
   *         description: User not found
   *       409:
   *         description: Email already registered
   *       401:
   *         description: Missing or invalid token
   *   delete:
   *     summary: Delete user
   *     tags:
   *       - Users
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: User removed
   *       404:
   *         description: User not found
   *       401:
   *         description: Missing or invalid token
   */
  routes.put("/api/users/:id", authenticateJwt, userController.update);
  routes.delete("/api/users/:id", authenticateJwt, userController.remove);

  return routes;
}

module.exports = { createRouter };
