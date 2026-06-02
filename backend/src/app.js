import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js"; 
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


export default app