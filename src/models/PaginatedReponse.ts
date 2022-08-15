import { z } from 'zod';

export function paginatedResponseSchema<T>(valueSchema: z.ZodSchema<T>) {
  return z.object({
    total: z.number().min(0),
    pages: z.number().min(0),
    next: z.string().url().nullable(),
    prev: z.string().url().nullable(),
    results: z.array(valueSchema)
  });
}

export type PaginatedResponse<T> = z.infer<ReturnType<typeof paginatedResponseSchema<T>>>;
