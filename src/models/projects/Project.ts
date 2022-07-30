import { ConcurrencySafeEntity, IConcurrencySafeEntity } from '../concurrency-safe-entity.model';
import { CountryCode, countryCodes } from '../country-codes';
import { Event, IEvent } from '../events';
import { Status } from '../status';

export interface IProject extends IConcurrencySafeEntity {
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
    readonly events: IEvent[];
}

export class Project extends ConcurrencySafeEntity implements IProject {
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
    readonly country: string;
    readonly cntr: string;
    readonly status: Status;
    readonly events: Event[];

    deserialize(input: IProject): this {
        const {
            name,
            shorthand,
            startDate,
            endDate,
            description,
            goals,
            vision,
            keywords,
            groupId,
            parentProjectId,
            subproject,
            countryCode,
            cntr,
            status
        } = input;

        super.deserialize(input);

        Object.assign(this, {
            name,
            shorthand,
            startDate,
            endDate,
            description,
            goals,
            vision,
            keywords,
            groupId,
            parentProjectId,
            subproject,
            countryCode,
            cntr,
            status
        });

        if (input.startDate) {
            Object.assign(this, { startDate: new Date(input.startDate) });
        }

        if (input.endDate) {
            Object.assign(this, { endDate: new Date(input.endDate) });
        }

        if (input.countryCode) {
            const code = countryCodes.find((country: CountryCode) => country.code == input.countryCode);
            Object.assign(this, { country: code?.name });
        }

        if (input.events) {
            const events = input.events.map((e) => new Event().deserialize(e));
            Object.assign(this, { events });
        }
        return this;
    }
}
