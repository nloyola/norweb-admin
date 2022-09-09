type Route = Record<string, string>;

export const API_ROUTES: Record<string, Route> = {
  people: {
    index: '/api/people/',
    person: '/api/people/:personId/'
  },
  projects: {
    index: '/api/projects/',
    project: '/api/projects/:projectId/',
    events: '/api/projects/:projectId/events/',
    event: '/api/projects/:projectId/events/:eventId/',
    keywords: '/api/projects/:projectId/keywords/',
    keyword: '/api/projects/:projectId/keywords/:keywordId/',
    funders: '/api/projects/:projectId/funders/',
    funder: '/api/projects/:projectId/funders/:funderId/',
    researchAreas: '/api/projects/:projectId/research-areas/',
    researchArea: '/api/projects/:projectId/research-areas/:researchAreaId/'
  },
  funders: {
    index: '/api/funders/',
    names: '/api/funders/names/',
    funder: '/api/funders/:funderId/'
  },
  researchAreas: {
    index: '/api/research-areas/',
    researchArea: '/api/research-areas/:researchAreaId/'
  }
};

export type ApiError = {
  status: number;
  error: any;
};

export async function fetchApi(route: string, init?: RequestInit) {
  const response = await fetch(route, {
    ...init,
    headers: {
      //Authorization: 'Basic ' + base64.encode('APIKEY:X'),
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const json = await response.json();
    const err = { status: response.status, error: json } as ApiError;
    console.error(err);
    throw err;
  }

  return response;
}

export function paginationToQueryParams(page: number, searchTerm: string): string {
  const params = new URLSearchParams();

  if (page > 1) {
    params.append('page', `${page}`);
  }

  if (searchTerm.length > 0) {
    params.append('search', searchTerm);
  }

  let paramsAsString = params.toString();
  if (paramsAsString.length <= 0) {
    return '';
  }
  return '?' + paramsAsString;
}

export function routeReplace(baseRoute: string, replacements: Record<string, string>): string {
  const result = baseRoute.replace(/\/(:\w+)\//gi, (_match, p1) => {
    const subst = replacements[p1] || p1;
    return `/${subst}/`;
  });
  return result;
}
