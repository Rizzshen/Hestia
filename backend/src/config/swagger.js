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
        Client: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            company_name: { type: "string", example: "Himalayan Herbs Co." },
            contact_name: { type: "string", example: "Priya Sharma" },
            email: { type: "string", example: "priya@himalayan.com" },
            country: { type: "string", example: "India" },
            currency: { type: "string", example: "USD" },
          },
        },
        ClientInput: {
          type: "object",
          required: ["company_name", "contact_name", "email", "country"],
          properties: {
            company_name: { type: "string", example: "Himalayan Herbs Co." },
            contact_name: { type: "string", example: "Priya Sharma" },
            email: { type: "string", example: "priya@himalayan.com" },
            country: { type: "string", example: "India" },
            currency: { type: "string", example: "USD" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            client_id: { type: "integer", example: 1 },
            company_name: { type: "string", example: "Himalayan Herbs Co." },
            status: { type: "string", example: "pending" },
            notes: { type: "string", example: "Urgent delivery" },
            created_at: { type: "string", example: "2026-01-01T00:00:00.000Z" },
          },
        },
        OrderInput: {
          type: "object",
          required: ["client_id"],
          properties: {
            client_id: { type: "integer", example: 1 },
            notes: { type: "string", example: "Urgent delivery" },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            order_id: { type: "integer", example: 1 },
            product_id: { type: "integer", example: 2 },
            product_name: { type: "string", example: "Stress Relief Capsules" },
            quantity: { type: "number", example: 10 },
            unit_price_at_time: { type: "number", example: 25.0 },
          },
        },
        OrderItemInput: {
          type: "object",
          required: ["product_id", "quantity"],
          properties: {
            product_id: { type: "integer", example: 2 },
            quantity: { type: "number", example: 10 },
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
