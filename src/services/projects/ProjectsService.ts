import { CountryCode, countryCodes } from '@app/models';
import { Project } from '@app/models/projects';
import format from 'date-fns/format';

export default class ProjectsService {
    private apiBaseUrl = `${process.env.NEXT_PUBLIC_SERVER}/api/projects/`;

    async add(project: Project): Promise<boolean> {
        const data = this.projectToApiRepr(project);
        const response = await fetch(this.apiBaseUrl, {
            headers: {
                //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        });

        return response.status < 400;
    }

    async update(project: Project): Promise<Project> {
        const data = this.projectToApiRepr(project);
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
            throw new Error(JSON.stringify(json, null, 2));
        }

        return new Project().deserialize(json);
    }

    private projectToApiRepr(project: Project): any {
        const countryCode = countryCodes.find((country: CountryCode) => country.name === project.country)?.code;
        return {
            ...project,
            startDate: format(project.startDate, 'yyy-MM-dd'),
            endDate: format(project.endDate, 'yyy-MM-dd'),
            countryCode
        };
    }
}
