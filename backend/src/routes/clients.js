import * as controller from "../controllers/clientsController.js";
import swagger from "../config/swagger.js";

import { Router } from "express";

const router = Router();

router.get("/", controller.getAllclients);
router.post("/", controller.addClient);
router.get("/:id", controller.getClientById);
router.put("/:id", controller.updateClient);
router.delete("/:id", controller.deleteClient);


export default router;