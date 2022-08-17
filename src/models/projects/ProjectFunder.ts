import { z } from 'zod';
import { domainEntitySchema } from '../DomainEntity';
import { funderNameSchema } from '../funders';

export const projectFunderSchema = domainEntitySchema.extend({
  projectId: z.number(),
  funderId: z.number(),
  hostOrganizationId: z.number().nullable(),
  title: z.string(),
  grantId: z.string().nullable(),
  grantType: z.string().nullable(),
  amount: z.string().nullable(),
  startDate: z.preprocess((a) => new Date(z.string().parse(a)), z.date()),
  endDate: z.nullable(z.preprocess((a) => new Date(z.string().parse(a)), z.date())),
  usage: z.string().nullable(),
  comment: z.string().nullable(),
  funder: funderNameSchema
});

export type ProjectFunder = z.infer<typeof projectFunderSchema>;

export type ProjectFunderAdd = Pick<
  ProjectFunder,
  | 'projectId'
  | 'funderId'
  | 'title'
  | 'grantId'
  | 'grantType'
  | 'amount'
  | 'startDate'
  | 'endDate'
  | 'usage'
  | 'comment'
>;

export type ProjectFunderUpdate = ProjectFunderAdd & Pick<ProjectFunder, 'id'>;
