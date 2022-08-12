import { PaginatedResponse, paginatedResponseSchema } from '@app/models';
import { Project, ProjectAdd, projectSchema, ProjectUpdate } from '@app/models/projects';
import { ProjectKeywordAdd, ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { dateToString } from '@app/utils/utils';

export class ProjectsService {
  private static apiBaseUrl = '/api/projects/';

  /**
   * Retrieves a Project using an ID.
   */
  static async get(id: number) {
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
    return projectSchema.parse(result);
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
    return paginatedResponseSchema(projectSchema).parse(result);
  }

  static async add(project: ProjectAdd) {
    const data = {
      data: {
        ...project,
        startDate: dateToString(project.startDate),
        endDate: dateToString(project.endDate)
      }
    };
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
    return projectSchema.parse(result);
  }

  static async update(project: ProjectUpdate) {
    const data = {
      data: {
        ...project,
        startDate: dateToString(project.startDate),
        endDate: dateToString(project.endDate)
      }
    };
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

    return projectSchema.parse(json);
  }

  static async addKeyword(projectId: number, keyword: ProjectKeywordAdd): Promise<Project> {
    const data = { data: keyword };
    const response = await fetch(this.apiBaseUrl + `${projectId}/keywords/`, {
      headers: {
        //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Not found');
      } else {
        throw new Error('HTTP error: status: ' + response.status);
      }
    }

    return result;
  }

  static async updateKeyword(projectId: number, keyword: ProjectKeywordUpdate): Promise<Project> {
    const data = { data: keyword };
    const url = `${this.apiBaseUrl}${projectId}/keywords/${keyword.id}/`;
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
      if (response.status === 404) {
        throw new Error('Not found');
      } else {
        throw new Error('HTTP error: status: ' + response.status);
      }
    }

    return json;
  }

  static async deleteKeyword(projectId: number, keywordId: number): Promise<Project> {
    const url = `${this.apiBaseUrl}${projectId}/keywords/${keywordId}/`;
    const response = await fetch(url, {
      headers: {
        //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    });

    const json = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Not found');
      } else {
        throw new Error('HTTP error: status: ' + response.status);
      }
    }

    return json;
  }
}
