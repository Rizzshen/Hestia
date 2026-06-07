import * as controller from "../controllers/ordersController.js";
import { Router } from "express";

const router = Router();

router.get("/", controller.getAllOrders);

router.get("/:id", controller.getOrderById);

router.post("/", controller.createOrder);
router.put("/:id", controller.updateOrder);

router.delete("/:id", controller.deleteOrder);

export default router;
