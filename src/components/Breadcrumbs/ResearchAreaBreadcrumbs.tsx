import { ResearchArea } from '@app/models/projects';
import { capitalizeWord } from '@app/utils/utils';
import { useQueryClient } from 'react-query';
import { matchPath, useLocation } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

export const ResearchAreaBreadcrumbs: React.FC<{ areaId: number }> = ({ areaId }) => {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const area = queryClient.getQueryData(['research-areas', areaId]) as ResearchArea;

  const pathnames = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathnames.map((name, index) => {
    const route = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;

    let label = name === 'research-areas' ? 'Research areas' : capitalizeWord(name);

    const researchAreaMatch = matchPath({ path: '/research-areas/:id', end: true }, route);
    if (area && researchAreaMatch && route === researchAreaMatch.pathname) {
      label = area.name;
    }

    return { label, route, isLast };
  });

  if (!area) {
    return null;
  }

  return <Breadcrumbs crumbs={breadcrumbs} />;
};
