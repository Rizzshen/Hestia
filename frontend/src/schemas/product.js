import { z } from "zod";
import { CURRENCIES } from "../constants/index";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  unit_price: z.coerce.number().min(0, "Unit price must be 0 or more"),
  currency: z.enum(CURRENCIES, { message: "Please select a valid currency" }),
  stock_qty: z.coerce.number().min(0, "Stock quantity must be 0 or more"),
});