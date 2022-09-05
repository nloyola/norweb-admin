import { z } from 'zod';
import { domainEntitySchema } from '../DomainEntity';

export const researchAreaSchema = domainEntitySchema.extend({
  name: z.string()
});

export type ResearchArea = z.infer<typeof researchAreaSchema>;

export type ResearchAreaAdd = Pick<ResearchArea, 'name'>;

export type ResearchAreaUpdate = ResearchAreaAdd & Pick<ResearchArea, 'id'>;
