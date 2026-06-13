import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(50).optional().default(""),
  company: z.string().max(120).optional().default(""),
  country: z.string().max(100).optional().default(""),
  interest: z.string().max(120).optional().default(""),
  message: z.string().min(10).max(3000)
});
