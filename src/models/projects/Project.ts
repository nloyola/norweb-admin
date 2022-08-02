import { ConcurrencySafeEntity } from '../ConcurrencySafeEntity';
import { Event } from '../events';
import { Status } from '../Status';

export interface Project extends ConcurrencySafeEntity {
    readonly name: string;
    readonly shorthand: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly description: string;
    readonly goals: string;
    readonly vision: string;
    readonly keywords: string;
    readonly groupId: number;
    readonly parentProjectId: number;
    readonly subproject: string;
    readonly countryCode: string;
    readonly cntr: string;
    readonly status: Status;
    readonly events: Event[];
}
