import { API_ROUTES, fetchApi, paginationToQueryParams, routeReplace } from '@app/api/api';
import { PaginatedResponse, paginatedResponseSchema } from '@app/models';
import { Event, EventAdd, eventSchema } from '@app/models/events';
import { dateToString } from '@app/utils/utils';

function eventRoute(projectId: number, eventId: number): string {
  return routeReplace(API_ROUTES.projects.event, {
    ':projectId': `${projectId}`,
    ':eventId': `${eventId}`
  });
}

export class ProjectEventsApi {
  static async get(projectId: number, eventId: number): Promise<Event> {
    const response = await fetchApi(eventRoute(projectId, eventId));
    const result = await response.json();
    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return eventSchema.parse(result);
  }

  static async paginate(projectId: number, page: number, searchTerm: string): Promise<PaginatedResponse<Event>> {
    const route =
      API_ROUTES.projects.events.replace(':projectId', `${projectId}`) + paginationToQueryParams(page, searchTerm);
    const response = await fetchApi(route);
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
    const route = API_ROUTES.projects.events.replace(':projectId', `${projectId}`);
    const response = await fetchApi(route, {
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
    const response = await fetchApi(eventRoute(projectId, event.id), {
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
