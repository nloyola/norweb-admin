import { paginatedResponseSchema } from '@app/models';
import { Funder, FunderAdd, FunderUpdate, funderSchema } from '@app/models/funders';

export class FundersService {
  private static apiBaseUrl = '/api/funders/';

  /**
   * Retrieves a Funder using an ID.
   */
  static async get(id: number): Promise<Funder> {
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
    return funderSchema.parse(result);
  }

  static async paginate(page: number, search: string) {
    let url = this.apiBaseUrl + `?page=${page}`;
    if (search !== '') {
      url = `${url}&search=${search}`;
    }

    const response = await fetch(url);
    const pagination = await response.json();
    if (!response.ok) {
      console.error(pagination);
      throw new Error('HTTP error: status: ' + response.status);
    }
    return paginatedResponseSchema(funderSchema).parse(pagination);
  }

  static async add(funder: FunderAdd): Promise<boolean> {
    const data = { data: funder };
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

  static async update(funder: FunderUpdate): Promise<Funder> {
    const data = { data: funder };
    const url = `${this.apiBaseUrl}${funder.id}/`;
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

  static async delete(funderId: number, keywordId: number): Promise<Funder> {
    const url = `${this.apiBaseUrl}${funderId}`;
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
