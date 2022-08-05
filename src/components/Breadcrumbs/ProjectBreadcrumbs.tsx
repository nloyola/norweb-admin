import { useLocation, matchPath } from 'react-router-dom';
import { capitalizeWord } from '@app/utils/utils';
import { Event } from '@app/models/events';
import { Project } from '@app/models/projects';
import { Breadcrumbs } from './Breadcrumbs';

// https://stackoverflow.com/questions/71592649/change-breadcrumb-component-that-was-done-with-react-router-v5-to-react-router-v

// https://pavsaund.com/post/2022-02-23-dynamic-breadcrumbs-and-routes-with-react-router/

type ProjectBreadcrumbsProps = {
  project: Project;
};

export function ProjectBreadcrumbs({ project }: ProjectBreadcrumbsProps) {
  const { pathname } = useLocation();

  const pathnames = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathnames.map((name, index) => {
    const route = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    let label = capitalizeWord(name);

    const projectMatch = matchPath({ path: '/projects/:id', end: true }, route);
    if (projectMatch && route === projectMatch.pathname) {
      label = project.name;
    }

    const eventMatch = matchPath({ path: '/projects/:projectId/events/:eventId', end: true }, route);
    if (eventMatch && route === eventMatch.pathname) {
      const eventId = Number(eventMatch.params.eventId);
      const event = project.events.find((ev: Event) => ev.id === eventId);
      if (event) {
        label = event.title;
      }
    }

    return { label, route, isLast };
  });

  return <Breadcrumbs crumbs={breadcrumbs} />;
}
