import { PaginatedResponse } from '@app/models';
import { Person } from '@app/models/people';

export class PeopleService {
  private static apiBaseUrl = '/api/people/';

  static async get(id: string): Promise<Person> {
    const url = this.apiBaseUrl + `${id}/`;
    const response = await fetch(url);
    const result = await response.json();
    if (!response.ok) {
      console.error(result);

      if (response.status === 404) {
        throw new Error('Not found');
      } else {
        throw new Error('HTTP error: status: ' + response.status);
      }
    }
    return result;
  }

  static async paginate(page: number, search: string): Promise<PaginatedResponse<Person>> {
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
    return result;
  }
}
