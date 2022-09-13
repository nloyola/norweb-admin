import { useProject } from '@app/hooks/useProject';
import { Project } from '@app/models/projects';
import { ProjectFunder } from '@app/models/projects/ProjectFunder';
import { capitalizeWord } from '@app/utils/utils';
import { useQueryClient } from 'react-query';
import { matchPath, useLocation } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

// https://stackoverflow.com/questions/71592649/change-breadcrumb-component-that-was-done-with-react-router-v5-to-react-router-v

// https://pavsaund.com/post/2022-02-23-dynamic-breadcrumbs-and-routes-with-react-router/

export const ProjectBreadcrumbs: React.FC<{ projectId: number }> = ({ projectId }) => {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const project = queryClient.getQueryData(['projects', projectId]) as Project;

  const pathnames = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathnames.map((name, index) => {
    const route = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    let label = capitalizeWord(name);

    const projectMatch = matchPath({ path: '/projects/:id', end: true }, route);
    if (project) {
      if (projectMatch && route === projectMatch.pathname) {
        label = project.name;
      }
    }

    const eventMatch = matchPath({ path: '/projects/:projectId/events/:eventId', end: true }, route);
    if (project && eventMatch && route === eventMatch.pathname) {
      const eventId = Number(eventMatch.params.eventId);
      const event = project.events.find((ev) => ev.id === eventId);

      if (event) {
        label = event.title;
      }
    }

    const funderMatch = matchPath({ path: '/projects/:projectId/funders/:funderId', end: true }, route);
    if (project && funderMatch && route === funderMatch.pathname) {
      const funderId = Number(funderMatch.params.funderId);
      const projectFunder = queryClient.getQueryData(['projects', projectId, 'funders', funderId]) as ProjectFunder;

      if (projectFunder) {
        label = projectFunder.title;
      }
    }

    return { label, route, isLast };
  });

  if (!project) {
    return null;
  }

  return <Breadcrumbs crumbs={breadcrumbs} />;
};
