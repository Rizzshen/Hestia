import * as controller from "../controllers/invoiceController.js";
import { Router } from "express";

const router = Router();
router.get("/:orderId", controller.invoice);

export default router;

