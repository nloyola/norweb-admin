import { paginatedResponseSchema } from '@app/models';
import { Funder, FunderAdd, FunderUpdate, funderSchema, funderNameSchema } from '@app/models/funders';
import { z } from 'zod';
import { API_ROUTES, fetchApi, paginationToQueryParams } from './api';

export class FundersApi {
  /**
   * Retrieves a Funder using an ID.
   */
  static async get(id: number): Promise<Funder> {
    const route = API_ROUTES.funders.funder.replace(':funderId', `${id}`);
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
    return funderSchema.parse(result);
  }

  static async paginate(page: number, searchTerm: string) {
    const route = API_ROUTES.funders.index + paginationToQueryParams(page, searchTerm);
    const response = await fetchApi(route);
    const pagination = await response.json();
    if (!response.ok) {
      console.error(pagination);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return paginatedResponseSchema(funderSchema).parse(pagination);
  }

  static async listNames() {
    let route = API_ROUTES.funders.names;
    const response = await fetchApi(route);
    const json = await response.json();
    if (!response.ok) {
      console.error(json);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return z.array(funderNameSchema).parse(json);
  }

  static async add(funder: FunderAdd) {
    const data = { data: funder };
    const response = await fetchApi(API_ROUTES.funders.index, {
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
    return funderSchema.parse(result);
  }

  static async update(funder: FunderUpdate) {
    const data = { data: funder };
    const route = API_ROUTES.funders.funder.replace(':funderId', `${funder.id}`);
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

    return funderSchema.parse(json);
  }

  static async delete(funderId: number) {
    const route = API_ROUTES.funders.funder.replace(':funderId', `${funderId}`);
    const response = await fetchApi(route, {
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
