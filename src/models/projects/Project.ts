import { z } from 'zod';
import { concurrencySafeEntitySchema } from '../ConcurrencySafeEntity';
import { CountryCodes } from '../CountryCodes';
import { eventBriefSchema } from '../events';
import { Status } from '../Status';
import { projectKeywordSchema } from './ProjectKeyword';

export const projectSchema = concurrencySafeEntitySchema.extend({
  name: z.string(),
  shorthand: z.string(),
  description: z.string(),
  startDate: z.preprocess((a) => new Date(z.string().parse(a)), z.date()),
  endDate: z.nullable(z.preprocess((a) => new Date(z.string().parse(a)), z.date())),
  goals: z.nullable(z.string()),
  vision: z.nullable(z.string()),
  groupId: z.number().min(1).nullable(),
  parentProjectId: z.number().min(1).nullable(),
  countryCode: z.nativeEnum(CountryCodes).nullable(),
  cntr: z.nullable(z.string()),
  status: z.nativeEnum(Status),
  events: z.array(eventBriefSchema),
  keywords: z.array(projectKeywordSchema)
});

export type Project = z.infer<typeof projectSchema>;

export type ProjectAdd = Pick<
  Project,
  'name' | 'shorthand' | 'startDate' | 'endDate' | 'description' | 'goals' | 'vision' | 'countryCode'
>;

export type ProjectUpdate = ProjectAdd & Pick<Project, 'id' | 'version' | 'status'>;
