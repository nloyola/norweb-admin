import { paginatedResponseSchema } from '@app/models';
import { personBriefSchema, personSchema } from '@app/models/people';

export class PeopleService {
  private static apiBaseUrl = '/api/people/';

  static async get(id: number) {
    const url = this.apiBaseUrl + `${id}`;
    const response = await fetch(url);
    const result = await response.json();
    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    const person = personSchema.parse(result);
    return person;
  }

  static async paginate(page: number, search: string) {
    let url = this.apiBaseUrl + `?page=${page}`;
    if (search !== '') {
      url = `${url}&search=${search}`;
    }

    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return paginatedResponseSchema(personBriefSchema).parse(result);
  }
}
