import { paginatedResponseSchema } from '@app/models';
import { Project, ProjectAdd, projectSchema } from '@app/models/projects';
import { ProjectFunderAdd, projectFunderSchema, ProjectFunderUpdate } from '@app/models/projects/ProjectFunder';
import { ProjectKeywordAdd, ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import {
  ProjectResearchAreaAdd,
  projectResearchAreaSchema,
  ProjectResearchAreaUpdate
} from '@app/models/projects/ProjectResearchArea';
import { dateToString } from '@app/utils/utils';
import { z } from 'zod';
import { ApiError, API_ROUTES, fetchApi, paginationToQueryParams, routeReplace } from './api';

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

function researchAreaRoute(projectId: number, researchAreaId: number): string {
  return routeReplace(API_ROUTES.projects.researchArea, {
    ':projectId': `${projectId}`,
    ':researchAreaId': `${researchAreaId}`
  });
}

export class ProjectsApi {
  /**
   * Retrieves a Project using an ID.
   */
  static async get(id: number) {
    if (id === undefined) {
      debugger;
    }

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
      method: 'DELETE'
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error('HTTP error: status: ' + response.status);
    }

    return projectSchema.parse(json);
  }

  static async getFunder(projectId: number, funderId: number) {
    const route = funderRoute(projectId, funderId);
    const response = await fetchApi(route);
    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return projectFunderSchema.parse(result);
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
    const data = { data: { ...funder, funder: undefined } };
    const response = await fetchApi(funderRoute(projectId, funder.id), {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    const json = await response.json();

    if (!response.ok) {
      console.error(json);
      throw new Error('HTTP error: status: ' + response.status);
    }

    return projectFunderSchema.parse(json);
  }

  static async deleteFunder(projectId: number, funderId: number) {
    const response = await fetchApi(funderRoute(projectId, funderId), {
      method: 'DELETE'
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error('HTTP error: status: ' + response.status);
    }

    return z.number().parse(json);
  }

  static async addResearchArea(projectId: number, researchArea: ProjectResearchAreaAdd) {
    const data = { data: researchArea };
    const route = API_ROUTES.projects.researchAreas.replace(':projectId', `${projectId}`);
    const response = await fetchApi(route, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return projectResearchAreaSchema.parse(result);
  }

  static async updateResearchArea(projectId: number, researchArea: ProjectResearchAreaUpdate) {
    const data = { data: { ...researchArea, researchArea: undefined } };
    const response = await fetchApi(researchAreaRoute(projectId, researchArea.id), {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    const json = await response.json();

    if (!response.ok) {
      console.error(json);
      throw new Error('HTTP error: status: ' + response.status);
    }

    return projectResearchAreaSchema.parse(json);
  }

  static async deleteResearchArea(projectId: number, researchAreaId: number) {
    const response = await fetchApi(researchAreaRoute(projectId, researchAreaId), {
      method: 'DELETE'
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error('HTTP error: status: ' + response.status);
    }

    return z.number().parse(json);
  }
}
