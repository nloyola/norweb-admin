import { CountryCode, countryCodes } from '@app/models';
import { Event } from '@app/models/events';
import format from 'date-fns/format';

export default class EventsService {
    private apiBaseUrl = `${process.env.NEXT_PUBLIC_SERVER}/api/events/`;

    async add(event: Event): Promise<boolean> {
        const data = this.eventToApiRepr(event);
        const response = await fetch(this.apiBaseUrl, {
            headers: {
                //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (response.status >= 400) {
            throw new Error(JSON.stringify(json, null, 2));
        }

        return response.status < 400;
    }

    async update(event: Event): Promise<Event> {
        const data = this.eventToApiRepr(event);
        const url = `${this.apiBaseUrl}${event.id}/`;
        const response = await fetch(url, {
            headers: {
                //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(data)
        });

        const json = await response.json();

        if (response.status >= 400) {
            throw new Error(JSON.stringify(json, null, 2));
        }

        return new Event().deserialize(json);
    }

    private eventToApiRepr(event: Event): any {
        const countryCode = countryCodes.find((country: CountryCode) => country.name === event.country)?.code;
        return {
            ...event,
            startDate: format(event.startDate, 'yyy-MM-dd'),
            endDate: format(event.endDate, 'yyy-MM-dd'),
            countryCode
        };
    }
}
