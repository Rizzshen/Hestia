import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import pool from "./config/db.js";

// Raw Materials routes
import rawMaterialsRouter from "./routes/rawMaterials.js";
//products routes
import productsRouter from "./routes/products.js";
//ingredients routes
import ingredientsRouter from "./routes/ingredients.js";

//clients routes
import clientsRouter from "./routes/clients.js";

//orders routes
import ordersRouter from "./routes/orders.js";

//orderItems routes
import orderItemsRouter from "./routes/orderItems.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// API routes
//raw materials routes

app.use("/api/raw-materials", rawMaterialsRouter);

//products routes
app.use("/api/products", productsRouter);

//ingredients routes

app.use("/api/products", ingredientsRouter);

//clients routes
app.use("/api/clients", clientsRouter);

//orders routes
app.use("/api/orders", ordersRouter);

//order items routes
app.use("/api/orders", orderItemsRouter);

// Swagger documentation route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

export default app;
