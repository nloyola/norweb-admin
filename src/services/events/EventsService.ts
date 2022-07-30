import { CountryCode, countryCodes } from '@app/models';
import { Event } from '@app/models/events';
import format from 'date-fns/format';

export class EventsService {
    private static apiBaseUrl = '/api/projects/';

    static async get(projectId: number, eventId: number): Promise<Event> {
        const url = this.apiBaseUrl + `${projectId}/events/${eventId}`;
        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
            console.error(result);
            throw new Error('HTTP error: status: ' + response.status);
        }
        return result;
    }

    static async add(projectId: number, event: Event): Promise<Event> {
        const data = { data: this.eventToApiRepr(event) };
        const response = await fetch(this.apiBaseUrl + `${projectId}/events/`, {
            headers: {
                //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (!response.ok) {
            console.error(result);
            throw new Error('HTTP error: status: ' + response.status);
        }

        return new Event().deserialize(result);
    }

    static async update(projectId: number, event: Event): Promise<Event> {
        const data = { data: this.eventToApiRepr(event) };
        const url = `${this.apiBaseUrl}${projectId}/events/${event.id}/`;
        const response = await fetch(url, {
            headers: {
                //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(data)
        });

        const json = await response.json();

        if (!response.ok) {
            console.error(json);
            throw new Error('HTTP error: status: ' + response.status);
        }

        return new Event().deserialize(json);
    }

    private static eventToApiRepr(event: Event): any {
        const countryCode = countryCodes.find((country: CountryCode) => country.name === event.country)?.code;
        return {
            ...event,
            startDate: format(event.startDate, 'yyy-MM-dd'),
            endDate: format(event.endDate, 'yyy-MM-dd'),
            countryCode
        };
    }
}
