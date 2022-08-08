import { ConcurrencySafeEntity } from '../ConcurrencySafeEntity';
import { Event } from '../events';
import { Status } from '../Status';
import { ProjectKeyword } from './ProjectKeyword';

export interface Project extends ConcurrencySafeEntity {
  readonly name: string;
  readonly shorthand: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly description: string;
  readonly goals: string;
  readonly vision: string;
  readonly groupId: number;
  readonly parentProjectId: number;
  readonly subproject: string;
  readonly countryCode: string;
  readonly cntr: string;
  readonly status: Status;
  readonly events: Event[];
  readonly keywords: ProjectKeyword[];
}

export type ProjectAdd = Pick<
  Project,
  'name' | 'shorthand' | 'startDate' | 'endDate' | 'description' | 'goals' | 'vision' | 'countryCode'
>;
