import { Status } from '@app/models';
import { ResearchArea, ResearchAreaAdd, ResearchAreaUpdate, researchAreaSchema } from '@app/models/projects';
import { z } from 'zod';
import { ApiError, API_ROUTES, fetchApi } from './api';

export class ResearchAreasApi {
  /**
   * Retrieves a ResearchArea using an ID.
   */
  static async get(id: number): Promise<ResearchArea> {
    const route = API_ROUTES.researchAreas.researchArea.replace(':researchAreaId', `${id}`);
    const response = await fetchApi(route);
    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      if (response.status === 404) {
        throw new Error('Not found');
      } else {
        throw new Error('HTTP error: status: ' + response.status);
      }
    }
    return researchAreaSchema.parse(result);
  }

  static async list(statusFilter?: Status) {
    let route = API_ROUTES.researchAreas.index;

    if (statusFilter) {
      route = `${route}?status=${statusFilter}`;
    }

    const response = await fetchApi(route);
    const json = await response.json();
    if (!response.ok) {
      console.error(json);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return z.array(researchAreaSchema).parse(json);
  }

  static async add(researchArea: ResearchAreaAdd) {
    const data = { data: researchArea };
    const response = await fetchApi(API_ROUTES.researchAreas.index, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
      console.error(result);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return researchAreaSchema.parse(result);
  }

  static async update(researchArea: ResearchAreaUpdate) {
    const data = { data: researchArea };
    const route = API_ROUTES.researchAreas.researchArea.replace(':researchAreaId', `${researchArea.id}`);
    const response = await fetchApi(route, {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    const json = await response.json();
    if (response.status >= 400) {
      console.error(json);
      throw new Error(JSON.stringify(json, null, 2));
    }

    return researchAreaSchema.parse(json);
  }

  static async delete(researchAreaId: number) {
    const route = API_ROUTES.researchAreas.researchArea.replace(':researchAreaId', `${researchAreaId}`);
    const response = await fetchApi(route, {
      method: 'DELETE'
    });

    return await response.json();
  }
}
