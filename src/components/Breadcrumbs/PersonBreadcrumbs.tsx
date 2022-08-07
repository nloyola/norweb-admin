import { useLocation, matchPath } from 'react-router-dom';
import { capitalizeWord } from '@app/utils/utils';
import { Person, personName } from '@app/models/people';
import { Breadcrumbs } from './Breadcrumbs';

type PersonBreadcrumbsProps = {
  person: Person;
};

export function PersonBreadcrumbs({ person }: PersonBreadcrumbsProps) {
  const { pathname } = useLocation();

  const pathnames = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathnames.map((name, index) => {
    const route = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    let label = capitalizeWord(name);

    const personMatch = matchPath({ path: '/people/:id', end: true }, route);
    if (personMatch && route === personMatch.pathname) {
      label = personName(person);
    }

    return { label, route, isLast };
  });

  return <Breadcrumbs crumbs={breadcrumbs} />;
}
