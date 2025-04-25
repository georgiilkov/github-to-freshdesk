import { z } from 'zod';

export const FreshdeskContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email().optional(),
  unique_external_id: z.string().min(1, "unique_external_id must be at least 1 characters long"),
  description: z.string().optional(),
}).strict();

export type FreshdeskContact = z.infer<typeof FreshdeskContactSchema>;