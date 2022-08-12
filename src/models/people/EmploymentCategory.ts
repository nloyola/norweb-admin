import { domainEntitySchema, Status } from '@app/models';
import { z } from 'zod';

export const employmentCategorySchema = domainEntitySchema.extend({
  name: z.string(),
  status: z.nativeEnum(Status)
});

export type EmploymentCategory = z.infer<typeof employmentCategorySchema>;
