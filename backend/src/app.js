import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import pool from "./config/db.js";

// Raw Materials routes
import rawMaterialsRouter from "./routes/rawMaterials.js";

import productsRouter from "./routes/products.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// API routes
app.use("/api/raw-materials", rawMaterialsRouter);
app.use("/api/products", productsRouter);

// Swagger documentation route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

export default app;
