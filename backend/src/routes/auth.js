import { Router } from "express";
import * as controller from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rishen
 *               email:
 *                 type: string
 *                 example: rishen@hestia.com
 *               password:
 *                 type: string
 *                 example: supersecret
 *               role:
 *                 type: string
 *                 enum: [admin, finance, business]
 *                 example: admin
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Email already in use
 */
router.post("/register", controller.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: rishen@hestia.com
 *               password:
 *                 type: string
 *                 example: supersecret
 *     responses:
 *       200:
 *         description: Logged in, cookie set
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", controller.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out, cookie cleared
 */
router.post("/logout", controller.logout);
router.get("/me", protect, controller.getMe);
export default router;
