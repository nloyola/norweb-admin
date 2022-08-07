import { useEffect } from 'react';
import { Alert, CircularProgress, Stack } from '@mui/material';
import { PersonBio } from '@app/components/people/PersonBio';
import { Person } from '@app/models/people';
import { PersonBreadcrumbs } from '@app/components/Breadcrumbs/PersonBreadcrumbs';
import { usePerson } from '@app/hooks/usePerson';
import { useParams } from 'react-router-dom';

export type PersonContextType = {
  person: Person;
  updatePerson: (p: Person) => void;
};

export function PersonPage() {
  const params = useParams();
  const { error, loading, person, loadPerson } = usePerson(Number(params.personId));

  useEffect(loadPerson, []);

  if (loading || !person) {
    return <CircularProgress />;
  }

  if (error !== '') {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <PersonBreadcrumbs person={person} />
      <PersonBio person={person} />
    </Stack>
  );
}
