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

// dashbaord router
import dashboardRouter from "./routes/dashboard.js";

//invoice Router
import invoiceRouter from "./routes/invoice.js";

//auth routes
import authRouter from "./routes/auth.js";

import cookieParser from "cookie-parser";

import { protect } from './middlewares/auth.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://hestia-eosin.vercel.app",
  "http://localhost:5173",
  "http://localhost:5000",
  "https://hestia-8rtcaiel7-rizzshens-projects.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean); // removes undefined if CLIENT_URL isn't set

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
// API routes
app.use("/api/auth", authRouter);
//raw materials routes

app.use("/api/raw-materials", protect, rawMaterialsRouter);

//products routes
app.use("/api/products",protect,  productsRouter);

//ingredients routes

app.use("/api/products", protect, ingredientsRouter);

//clients routes
app.use("/api/clients", protect, clientsRouter);

//orders routes
app.use("/api/orders", protect, ordersRouter);

//order items routes
app.use("/api/orders", protect, orderItemsRouter);

// Dashboard route
app.use("/api/dashboard", protect, dashboardRouter);

//invoice routes
app.use("/api/invoice", protect, invoiceRouter);
// Swagger documentation route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.redirect("/api/docs");
});

pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

export default app;
