import * as controller from "../controllers/ingredientsController.js";
import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ingredients
 *   description: Manage raw material ingredients linked to a product
 */

/**
 * @swagger
 * /api/products/{id}/ingredients:
 *   get:
 *     summary: Get all ingredients for a product
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 */
router.get("/:id/ingredients", controller.getIngredient);

/**
 * @swagger
 * /api/products/{id}/ingredients:
 *   post:
 *     summary: Add an ingredient to a product
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IngredientInput'
 *     responses:
 *       201:
 *         description: Ingredient added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       400:
 *         description: Raw material not found
 */
router.post("/:id/ingredients", controller.addIngredient);

/**
 * @swagger
 * /api/products/{id}/ingredients/{ingredientId}:
 *   put:
 *     summary: Update an ingredient's quantity
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ingredient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IngredientInput'
 *     responses:
 *       200:
 *         description: Ingredient updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ingredient'
 *       404:
 *         description: Ingredient not found
 */
router.put("/:id/ingredients/:ingredientId", controller.updateIngredient);

/**
 * @swagger
 * /api/products/{id}/ingredients/{ingredientId}:
 *   delete:
 *     summary: Remove an ingredient from a product
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: path
 *         name: ingredientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ingredient ID
 *     responses:
 *       204:
 *         description: Ingredient deleted
 *       404:
 *         description: Ingredient not found
 */
router.delete("/:id/ingredients/:ingredientId", controller.deleteIngredient);

export default router;
