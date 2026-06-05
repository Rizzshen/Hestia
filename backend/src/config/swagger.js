import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hestia API",
      version: "1.0.0",
      description: "Internal business operations dashboard API",
    },
    components: {
      schemas: {
        RawMaterial: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Ashwagandha Root" },
            unit: { type: "string", example: "kg" },
            stock_qty: { type: "number", example: 50.0 },
            low_stock_threshold: { type: "number", example: 10.0 },
          },
        },
        RawMaterialInput: {
          type: "object",
          required: ["name", "unit"],
          properties: {
            name: { type: "string", example: "Ashwagandha Root" },
            unit: { type: "string", example: "kg" },
            stock_qty: { type: "number", example: 50.0 },
            low_stock_threshold: { type: "number", example: 10.0 },
          },
        }, // <--- Closed RawMaterialInput here
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Calming Lavender Soap" },
            description: {
              type: "string",
              example: "Handcrafted soap with essential oils",
            },
            unit_price: { type: "number", example: 12.5 },
            currency: { type: "string", example: "USD" },
            stock_qty: { type: "number", example: 100 },
          },
        },
        ProductInput: {
          type: "object",
          required: ["name", "unit_price", "currency"],
          properties: {
            name: { type: "string", example: "Calming Lavender Soap" },
            description: {
              type: "string",
              example: "Handcrafted soap with essential oils",
            },
            unit_price: { type: "number", example: 12.5 },
            currency: { type: "string", example: "USD" },
            stock_qty: { type: "number", example: 100 },
          },
        },
        Ingredient: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            product_id: { type: "integer", example: 1 },
            raw_material_id: { type: "integer", example: 3 },
            raw_material_name: { type: "string", example: "Ashwagandha Root" },
            unit: { type: "string", example: "kg" },
            quantity_needed: { type: "number", example: 0.5 },
          },
        },
        IngredientInput: {
          type: "object",
          required: ["raw_material_id", "quantity_needed"],
          properties: {
            raw_material_id: { type: "integer", example: 3 },
            quantity_needed: { type: "number", example: 0.5 },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "An error occurred" },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "../routes/*.js")], // Scans your route files
};

export const swaggerSpec = swaggerJSDoc(options);
