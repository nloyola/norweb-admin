import { z } from 'zod';
import { concurrencySafeEntitySchema } from './ConcurrencySafeEntity';
import { Status } from './Status';

export const milestoneSchema = concurrencySafeEntitySchema.extend({
  name: z.string(),
  description: z.string(),
  startDate: z.preprocess((a) => new Date(z.string().parse(a)), z.date()),
  endDate: z.nullable(z.preprocess((a) => new Date(z.string().parse(a)), z.date())),
  status: z.nativeEnum(Status)
});

export type Milestone = z.infer<typeof milestoneSchema>;

export type MilestoneAdd = Pick<Milestone, 'name' | 'description' | 'startDate' | 'endDate'>;

export type MilestoneUpdate = MilestoneAdd & Pick<Milestone, 'id' | 'version' | 'status'>;
