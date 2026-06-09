import { Router } from "express";
import * as controller from "../controllers/dashboardController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Business metrics and overview
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders_by_status:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         example: pending
 *                       count:
 *                         type: string
 *                         example: "8"
 *                 total_clients:
 *                   type: string
 *                   example: "15"
 *                 recent_orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 low_stock_materials:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RawMaterial'
 *       500:
 *         description: Internal server error
 */
router.get("/", controller.getDashbaordMetrics);

export default router;
