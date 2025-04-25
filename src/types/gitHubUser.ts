import { z } from 'zod';

export const GitHubUserSchema = z.object({
  login: z.string().min(2, "Login must be at least 2 characters long"),
  id: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters long").nullable(),
  email: z.string().email().nullable()
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;