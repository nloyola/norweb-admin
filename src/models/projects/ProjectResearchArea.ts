import { z } from 'zod';
import { domainEntitySchema } from '../DomainEntity';
import { researchAreaSchema } from './ResearchArea';

export const projectResearchAreaSchema = domainEntitySchema.extend({
  projectId: z.number(),
  researchAreaId: z.number(),
  isKeyArea: z.boolean(),
  researchArea: researchAreaSchema.optional()
});

export type ProjectResearchArea = z.infer<typeof projectResearchAreaSchema>;

export type ProjectResearchAreaAdd = Pick<ProjectResearchArea, 'projectId' | 'researchAreaId' | 'isKeyArea'>;

export type ProjectResearchAreaUpdate = ProjectResearchAreaAdd & Pick<ProjectResearchArea, 'id'>;
