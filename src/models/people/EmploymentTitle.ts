import { domainEntitySchema, Status } from '@app/models';
import { z } from 'zod';
import { employmentCategorySchema } from './EmploymentCategory';

export const employmentTitleBriefSchema = z.object({
  name: z.string(),
  status: z.nativeEnum(Status)
});

export const employmentTitleSchema = employmentTitleBriefSchema.merge(domainEntitySchema).extend({
  employmentCategoryId: z.number().min(1),
  category: employmentCategorySchema
});

export type EmploymentTitle = z.infer<typeof employmentTitleSchema>;
