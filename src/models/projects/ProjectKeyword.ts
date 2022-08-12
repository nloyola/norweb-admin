import { z } from 'zod';
import { domainEntitySchema } from '../DomainEntity';

export const projectKeywordSchema = domainEntitySchema.extend({
  name: z.string(),
  weight: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().min(0).max(1))
});

export type ProjectKeyword = z.infer<typeof projectKeywordSchema>;

export type ProjectKeywordAdd = Pick<ProjectKeyword, 'name' | 'weight'>;

export type ProjectKeywordUpdate = ProjectKeywordAdd & Pick<ProjectKeyword, 'id'>;
