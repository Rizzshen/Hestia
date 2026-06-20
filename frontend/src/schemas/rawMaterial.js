import { z } from "zod";
import { UNITS } from "../constants";

export const rawMaterialSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  unit: z.enum(UNITS, { message: "Please select a valid unit" }),
  stock_qty: z.coerce.number().min(0, "Stock quantity must be 0 or more"),
  low_stock_threshold: z.coerce.number().min(0, "Threshold must be 0 or more"),
});