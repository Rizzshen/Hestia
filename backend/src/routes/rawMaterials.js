import { Router } from 'express';
import * as controller from '../controllers/rawMaterialsController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Raw Materials
 *   description: Raw material inventory management
 */

/**
 * @swagger
 * /api/raw-materials:
 *   get:
 *     summary: Get all raw materials
 *     tags: [Raw Materials]
 *     responses:
 *       200:
 *         description: List of all raw materials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RawMaterial'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   get:
 *     summary: Get a raw material by ID
 *     tags: [Raw Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Raw material found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RawMaterial'
 *       404:
 *         description: Raw material not found
 */
router.get('/:id', controller.getOne);

/**
 * @swagger
 * /api/raw-materials:
 *   post:
 *     summary: Create a new raw material
 *     tags: [Raw Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RawMaterialInput'
 *     responses:
 *       201:
 *         description: Raw material created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RawMaterial'
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   put:
 *     summary: Update a raw material
 *     tags: [Raw Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RawMaterialInput'
 *     responses:
 *       200:
 *         description: Raw material updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RawMaterial'
 *       404:
 *         description: Raw material not found
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/raw-materials/{id}:
 *   delete:
 *     summary: Delete a raw material
 *     tags: [Raw Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Raw material deleted
 *       404:
 *         description: Raw material not found
 */
router.delete('/:id', controller.remove);

export default router;