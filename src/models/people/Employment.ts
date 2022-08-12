import { domainEntitySchema } from '@app/models';
import { z } from 'zod';
import { employmentTitleBriefSchema } from './EmploymentTitle';

export const employmentSchema = domainEntitySchema.extend({
  type: z.string(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .nullable(),
  office: z.nullable(z.string()),
  branch: z.nullable(z.string()),
  personId: z.number().min(1),
  employmentTitleId: z.number().min(1),
  groupId: z.number().min(1).nullable(),
  title: z.optional(employmentTitleBriefSchema)
});

export type Employment = z.infer<typeof employmentSchema>;
