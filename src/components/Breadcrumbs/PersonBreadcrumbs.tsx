import { usePerson } from '@app/hooks/usePerson';
import { personName } from '@app/models/people';
import { capitalizeWord } from '@app/utils/utils';
import { matchPath, useLocation } from 'react-router-dom';
import { Breadcrumbs } from './Breadcrumbs';

export const PersonBreadcrumbs: React.FC<{ personId: number }> = ({ personId }) => {
  const { pathname } = useLocation();
  const { isError, isLoading, data: person } = usePerson(personId);

  const pathnames = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathnames.map((name, index) => {
    const route = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    let label = capitalizeWord(name);

    const personMatch = matchPath({ path: '/people/:id', end: true }, route);
    if (person && personMatch && route === personMatch.pathname) {
      label = personName(person);
    }

    return { label, route, isLast };
  });

  if (isError || isLoading || !person) {
    return null;
  }

  return <Breadcrumbs crumbs={breadcrumbs} />;
};
