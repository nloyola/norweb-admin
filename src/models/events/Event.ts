import { EventType } from './EventType';
import { DomainEntity } from '@app/models';

export interface Event extends DomainEntity {
  readonly title: string;
  readonly description: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly venue: string;
  readonly organizer: string;
  readonly url: string;
  readonly type: EventType;
  readonly projectId: number;
}

export type EventAdd = Pick<
  Event,
  'title' | 'description' | 'startDate' | 'endDate' | 'venue' | 'organizer' | 'url' | 'type'
>;
