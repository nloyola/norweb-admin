import { z } from 'zod';
import { domainEntitySchema } from '../DomainEntity';
import { milestoneSchema } from '../Milestone';

export const projectMilestoneSchema = domainEntitySchema.extend({
  projectId: z.number(),
  milestoneId: z.number(),
  milestone: milestoneSchema.nullable()
});

export type ProjectMilestone = z.infer<typeof projectMilestoneSchema>;

export type ProjectMilestoneAdd = Pick<ProjectMilestone, 'projectId' | 'milestoneId'>;

export type ProjectMilestoneUpdate = ProjectMilestoneAdd & Pick<ProjectMilestone, 'id'>;
