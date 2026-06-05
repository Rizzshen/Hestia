import swaggerJSDoc from "swagger-jsdoc";
import * as controller from "../controllers/ingredientsController.js";
import { Router } from "express";

const router = Router();


router.get("/:id/ingredients", controller.getIngredient);

router.post("/:id/ingredients", controller.addIngredient);

router.put("/:id/ingredients/:ingredientId", controller.updateIngredient);

router.delete("/:id/ingredients/:ingredientId", controller.deleteIngredient);
export default router;