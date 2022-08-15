import { useProject } from '@app/hooks/useProject';
import { capitalizeWord } from '@app/utils/utils';
import { matchPath, useLocation } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

// https://stackoverflow.com/questions/71592649/change-breadcrumb-component-that-was-done-with-react-router-v5-to-react-router-v

// https://pavsaund.com/post/2022-02-23-dynamic-breadcrumbs-and-routes-with-react-router/

export const ProjectBreadcrumbs: React.FC<{ projectId: number }> = ({ projectId }) => {
  const { pathname } = useLocation();
  const projectQuery = useProject(projectId);

  const pathnames = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathnames.map((name, index) => {
    const route = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    let label = capitalizeWord(name);

    const projectMatch = matchPath({ path: '/projects/:id', end: true }, route);
    if (projectQuery.data) {
      if (projectMatch && route === projectMatch.pathname) {
        label = projectQuery.data.name;
      }
    }

    const eventMatch = matchPath({ path: '/projects/:projectId/events/:eventId', end: true }, route);
    if (projectQuery.data && eventMatch && route === eventMatch.pathname) {
      const eventId = Number(eventMatch.params.eventId);
      const event = projectQuery.data.events.find((ev) => ev.id === eventId);

      if (event) {
        label = event.title;
      }
    }

    return { label, route, isLast };
  });

  if (projectQuery.isError || projectQuery.isLoading) {
    return null;
  }

  return <Breadcrumbs crumbs={breadcrumbs} />;
};
