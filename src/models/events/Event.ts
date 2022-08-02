import { EventType } from './EventType';
import { DomainEntity } from '@app/models';

export interface Event extends DomainEntity {
    readonly title: string;
    readonly description: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly venue: string;
    readonly organizer: string;
    readonly url: string;
    readonly type: EventType;
    readonly projectId: number;
}
