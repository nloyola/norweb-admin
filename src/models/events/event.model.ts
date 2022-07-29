import { Deserializable } from '@app/models';
import { ConcurrencySafeEntity, IConcurrencySafeEntity } from '../concurrency-safe-entity.model';
import { Status } from '../status';
import { EventType } from './event-type.enum';

export interface IEvent extends IConcurrencySafeEntity {
    readonly title: string;
    readonly description: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly venue: string;
    readonly organizer: string;
    readonly url: string;
    readonly type: EventType;
    readonly status: Status;
}

export class Event extends ConcurrencySafeEntity implements IEvent, Deserializable {
    readonly title: string;
    readonly description: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly venue: string;
    readonly organizer: string;
    readonly url: string;
    readonly type: EventType;
    readonly status: Status;

    deserialize(input: IEvent): this {
        const { title, description, startDate, endDate, venue, organizer, url, type, status } = input;

        super.deserialize(input);

        Object.assign(this, {
            title,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            venue,
            organizer,
            url,
            type,
            status
        });

        return this;
    }
}
