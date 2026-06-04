import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hestia API',
      version: '1.0.0',
      description: 'Internal business operations dashboard API',
    },
    components: {    
      schemas: {
        RawMaterial: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Ashwagandha Root' },
            unit: { type: 'string', example: 'kg' },
            stock_qty: { type: 'number', example: 50.00 },
            low_stock_threshold: { type: 'number', example: 10.00 },
          },
        },
        RawMaterialInput: {
          type: 'object',
          required: ['name', 'unit'],
          properties: {
            name: { type: 'string', example: 'Ashwagandha Root' },
            unit: { type: 'string', example: 'kg' },
            stock_qty: { type: 'number', example: 50.00 },
            low_stock_threshold: { type: 'number', example: 10.00 },
          },
        },
        // You will add Error, Product, Client, Order schemas here later
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'An error occurred' },
          },
        }
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')], // Scans your route files
};

export const swaggerSpec = swaggerJSDoc(options);