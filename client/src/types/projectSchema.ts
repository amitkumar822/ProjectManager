import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.date().optional(),
  status: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

