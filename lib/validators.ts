import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['CUSTOMER', 'PROVIDER', 'ADMIN']).optional().default('CUSTOMER')
});

export const LoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128)
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
