import { z } from "zod";

export const orderSchema = z.object({
  client_id: z.coerce.number().min(1, "Client is required"),
  notes: z.string().trim().optional(),
});
