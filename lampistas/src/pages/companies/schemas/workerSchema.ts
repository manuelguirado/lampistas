import { z } from 'zod';

export const registerSchema  = z.object({
  body: z.object({
    name : z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  }),
});
export const editSchema  = z.object({
  body: z.object({
    workerID : z.number(),
    name : z.string().min(2, 'Name must be at least 2 characters long').optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  }),
});