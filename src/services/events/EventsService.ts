import { PaginatedResponse, paginatedResponseSchema } from '@app/models';
import { Event, EventAdd, eventSchema, EventUpdate } from '@app/models/events';
import { dateToString } from '@app/utils/utils';

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
    return eventSchema.parse(result);
  }

  static async paginate(projectId: number, page: number, search: string): Promise<PaginatedResponse<Event>> {
    let url = this.apiBaseUrl + `${projectId}/events/?page=${page}`;
    if (search !== '') {
      url = `${url}&search=${search}`;
    }

    const response = await fetch(url);
    const result = await response.json();
    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return paginatedResponseSchema(eventSchema).parse(result);
  }

  static async add(projectId: number, event: EventAdd): Promise<Event> {
    const data = {
      data: {
        ...event,
        startDate: dateToString(event.startDate),
        endDate: dateToString(event.endDate)
      }
    };
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

    return eventSchema.parse(result);
  }

  static async update(projectId: number, event: Event): Promise<Event> {
    const data = {
      data: {
        ...event,
        startDate: dateToString(event.startDate),
        endDate: dateToString(event.endDate)
      }
    };
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

    return eventSchema.parse(json);
  }
}
