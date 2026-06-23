import { z } from "zod";
import { CURRENCIES } from "../constants/index";

export const clientSchema = z
  .object({
    company_name: z.string().trim().optional(),
    contact_name: z.string().trim().optional(),
    country: z.string().trim().min(1),
    currency: z.enum(CURRENCIES),
    email: z.string().email(),
  })
  .refine(
    (data) => data.company_name || data.contact_name,
    {
      message: "Either company name or contact name is required",
      path: ["company_name"],
    }
  );
