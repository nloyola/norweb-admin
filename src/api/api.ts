type Route = Record<string, string>;

export const API_ROUTES: Record<string, Route> = {
  people: {
    index: '/api/people/',
    person: '/api/people/:personId/'
  },
  projects: {
    index: '/api/projects/',
    project: '/api/projects/:projectId/',
    keywords: '/api/projects/:projectId/keywords/',
    keyword: '/api/projects/:projectId/keywords/:keywordId/',
    funders: '/api/projects/:projectId/funders/',
    funder: '/api/projects/:projectId/funders/:funderId/',
    events: '/api/projects/:projectId/events/',
    event: '/api/projects/:projectId/events/:eventId/'
  },
  funders: {
    index: '/api/funders/',
    names: '/api/funders/names/',
    funder: '/api/funders/:funderId/'
  }
};

export function fetchApi(route: string, init?: RequestInit) {
  return fetch(route, init);
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
