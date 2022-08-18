import { paginatedResponseSchema } from '@app/models';
import { personBriefSchema, personSchema } from '@app/models/people';
import { API_ROUTES, fetchApi, paginationToQueryParams } from './api';

export class PeopleApi {
  static async get(id: number) {
    const route = API_ROUTES.people.person.replace(':personId', `${id}`);
    const response = await fetchApi(route);
    const result = await response.json();
    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    const person = personSchema.parse(result);
    return person;
  }

  static async paginate(page: number, searchTerm: string) {
    const route = API_ROUTES.people.index + paginationToQueryParams(page, searchTerm);
    const response = await fetchApi(route);
    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return paginatedResponseSchema(personBriefSchema).parse(result);
  }
}
