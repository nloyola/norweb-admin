import { ResearchAreasApi } from '@app/api/ResearchAreasApi';
import { capitalizeWord } from '@app/utils/utils';
import { useQuery } from 'react-query';
import { matchPath, useLocation } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

export const ResearchAreaBreadcrumbs: React.FC<{ areaId: number }> = ({ areaId }) => {
  const { pathname } = useLocation();
  const {
    isError,
    isLoading,
    data: area
  } = useQuery(['research-areas', areaId], async () => ResearchAreasApi.get(areaId));

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

  if (isError || isLoading || !area) {
    return null;
  }

  return <Breadcrumbs crumbs={breadcrumbs} />;
};
