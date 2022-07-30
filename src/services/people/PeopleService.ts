import { PaginatedResponse } from '@app/models';
import { IPerson } from '@app/models/people';

export class PeopleService {
    private static apiBaseUrl = '/api/people/';

    static async get(id: string): Promise<IPerson> {
        const url = this.apiBaseUrl + `${id}/`;
        const response = await fetch(url);
        const result = await response.json();
        if (!response.ok) {
            console.error(result);
            throw new Error('HTTP error: status: ' + response.status);
        }
        return result;
    }

    static async paginate(page: number, search: string): Promise<PaginatedResponse<IPerson>> {
        let url = this.apiBaseUrl + `?page=${page}`;
        if (search !== '') {
            url = `${url}&search=${search}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            console.error(result);
            throw new Error('HTTP error: status: ' + response.status);
        }
        const result = await response.json();
        return result;
    }
}
