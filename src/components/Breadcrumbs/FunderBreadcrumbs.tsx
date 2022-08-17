import { useFunder } from '@app/hooks/useFunder';
import { capitalizeWord } from '@app/utils/utils';
import { matchPath, useLocation } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

export const FunderBreadcrumbs: React.FC<{ funderId: number }> = ({ funderId }) => {
  const { pathname } = useLocation();
  const { isError, isLoading, data: funder } = useFunder(funderId);

  const pathnames = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathnames.map((name, index) => {
    const route = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    let label = capitalizeWord(name);

    const funderMatch = matchPath({ path: '/funders/:id', end: true }, route);
    if (funder && funderMatch && route === funderMatch.pathname) {
      label = funder.name;
    }

    return { label, route, isLast };
  });

  if (isError || isLoading || !funder) {
    return null;
  }

  return <Breadcrumbs crumbs={breadcrumbs} />;
};
