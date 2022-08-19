import { paginatedResponseSchema } from '@app/models';
import { Project, ProjectAdd, projectSchema } from '@app/models/projects';
import { ProjectFunderAdd, projectFunderSchema, ProjectFunderUpdate } from '@app/models/projects/ProjectFunder';
import { ProjectKeywordAdd, ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { dateToString } from '@app/utils/utils';
import { API_ROUTES, fetchApi, paginationToQueryParams, routeReplace } from './api';

function keywordRoute(projectId: number, keywordId: number): string {
  return routeReplace(API_ROUTES.projects.keyword, {
    ':projectId': `${projectId}`,
    ':keywordId': `${keywordId}`
  });
}

function funderRoute(projectId: number, funderId: number): string {
  return routeReplace(API_ROUTES.projects.funder, {
    ':projectId': `${projectId}`,
    ':funderId': `${funderId}`
  });
}

export class ProjectsApi {
  /**
   * Retrieves a Project using an ID.
   */
  static async get(id: number) {
    const route = API_ROUTES.projects.project.replace(':projectId', `${id}`);
    const response = await fetchApi(route);
    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return projectSchema.parse(result);
  }

  static async paginate(page: number, searchTerm: string) {
    const route = API_ROUTES.projects.index + paginationToQueryParams(page, searchTerm);
    const response = await fetchApi(route);
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
        name: project.name,
        shorthand: project.shorthand,
        startDate: dateToString(project.startDate),
        endDate: dateToString(project.endDate),
        description: project.description,
        goals: project.goals,
        vision: project.vision,
        countryCode: project.countryCode
      }
    };
    const response = await fetchApi(API_ROUTES.projects.index, {
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

  static async update(project: Project) {
    const data = {
      data: {
        id: project.id,
        version: project.version,
        name: project.name,
        shorthand: project.shorthand,
        startDate: dateToString(project.startDate),
        endDate: dateToString(project.endDate),
        description: project.description,
        goals: project.goals,
        vision: project.vision,
        countryCode: project.countryCode,
        status: project.status
      }
    };

    const route = API_ROUTES.projects.project.replace(':projectId', `${project.id}`);
    const response = await fetchApi(route, {
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

  static async addKeyword(projectId: number, keyword: ProjectKeywordAdd) {
    const data = { data: keyword };
    const route = API_ROUTES.projects.keywords.replace(':projectId', `${projectId}`);
    const response = await fetchApi(route, {
      headers: {
        //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await response.json();

    if (!response.ok) {
      console.error(json);
      throw new Error('HTTP error: status: ' + response.status);
    }

    return projectSchema.parse(json);
  }

  static async updateKeyword(projectId: number, keyword: ProjectKeywordUpdate) {
    const data = { data: { ...keyword, projectId } };
    const response = await fetchApi(keywordRoute(projectId, keyword.id), {
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

    return projectSchema.parse(json);
  }

  static async deleteKeyword(projectId: number, keywordId: number): Promise<Project> {
    const response = await fetchApi(keywordRoute(projectId, keywordId), {
      headers: {
        //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error('HTTP error: status: ' + response.status);
    }

    return projectSchema.parse(json);
  }

  static async paginateFunders(projectId: number, page: number, searchTerm: string) {
    const route =
      API_ROUTES.projects.funders.replace(':projectId', `${projectId}`) + paginationToQueryParams(page, searchTerm);
    const response = await fetchApi(route);
    const result = await response.json();
    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return paginatedResponseSchema(projectFunderSchema).parse(result);
  }

  static async addFunder(projectId: number, funder: ProjectFunderAdd) {
    const data = {
      data: {
        ...funder,
        hostOrganizationId: null // FIXME: assign this after Organizations are added to the REST API
      }
    };
    const route = API_ROUTES.projects.funders.replace(':projectId', `${projectId}`);
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
      throw new Error('HTTP error: status: ' + response.status);
    }

    return projectFunderSchema.parse(result);
  }

  static async updateFunder(projectId: number, funder: ProjectFunderUpdate) {
    const data = { data: funder };
    const response = await fetchApi(funderRoute(projectId, funder.id), {
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
        throw new Error('HTTP error: status: ' + response.status);
      }

      return projectFunderSchema.parse(json);
    }
  }

  static async deleteFunder(projectId: number, funderId: number) {
    const response = await fetchApi(funderRoute(projectId, funderId), {
      headers: {
        //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error('HTTP error: status: ' + response.status);
    }

    return projectSchema.parse(json);
  }
}
