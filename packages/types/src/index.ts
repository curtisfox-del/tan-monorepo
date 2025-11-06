import { z } from "zod";

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
export type LoginRequest = z.infer<typeof LoginRequest>;

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export type Post = z.infer<typeof PostSchema>;