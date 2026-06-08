import * as controller from "../controllers/orderItemsController.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Order Items
 *   description: Manage items within an order
 */

/**
 * @swagger
 * /api/orders/{id}/items:
 *   get:
 *     summary: Get all items for an order
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: List of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 */
router.get("/:id/items", controller.getItemsByOrderId);

/**
 * @swagger
 * /api/orders/{id}/items:
 *   post:
 *     summary: Add an item to an order
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItemInput'
 *     responses:
 *       201:
 *         description: Item added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderItem'
 *       400:
 *         description: Product not found
 */
router.post("/:id/items", controller.addItem);

/**
 * @swagger
 * /api/orders/{id}/items/{itemId}:
 *   delete:
 *     summary: Remove an item from an order
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     responses:
 *       204:
 *         description: Item removed
 *       404:
 *         description: Item not found
 */
router.delete("/:id/items/:itemId", controller.removeItem);

export default router;