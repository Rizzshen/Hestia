import { z } from "zod";

export const rawMaterialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  unit: z.string().min(1, "Unit is required"),
  stock_qty: z.coerce.number().min(0, "Stock quantity must be 0 or more"),
  low_stock_threshold: z.coerce.number().min(0, "Threshold must be 0 or more"),
});