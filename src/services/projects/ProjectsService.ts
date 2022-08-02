import { CountryCode, countryCodes, PaginatedResponse } from '@app/models';
import { Project } from '@app/models/projects';
import format from 'date-fns/format';

export class ProjectsService {
    private static apiBaseUrl = '/api/projects/';

    static async get(id: number): Promise<Project> {
        const url = this.apiBaseUrl + `${id}/`;
        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
            console.error(result);
            throw new Error('HTTP error: status: ' + response.status);
        }
        return result;
    }

    static async paginate(page: number, search: string): Promise<PaginatedResponse<Project>> {
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

    static async add(project: Project): Promise<boolean> {
        const data = { data: this.projectToApiRepr(project) };
        const response = await fetch(this.apiBaseUrl, {
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
        return true;
    }

    static async update(project: Project): Promise<Project> {
        const data = { data: this.projectToApiRepr(project) };
        const url = `${this.apiBaseUrl}${project.id}/`;
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
            console.error(json);
            throw new Error(JSON.stringify(json, null, 2));
        }

        return json;
    }

    private static projectToApiRepr(project: Project): any {
        const countryCode = countryCodes.find((country: CountryCode) => country.name === project.countryCode)?.code;
        return {
            ...project,
            countryCode,
            events: undefined
        };
    }
}
