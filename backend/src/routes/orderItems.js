import * as controller from "../controllers/orderItemsController.js";
import { Router } from "express";

const router = Router();

router.get("/:id/items", controller.getItemsByOrderId);

router.post("/:id/items", controller.addItem);

router.delete("/:id/items/:itemId", controller.removeItem);

export default router;