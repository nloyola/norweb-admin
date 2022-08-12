import { useEffect, useState } from 'react';
import { Alert, Avatar, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { Person, personName, personTitles } from '@app/models/people';
import { PersonBreadcrumbs } from '@app/components/Breadcrumbs/PersonBreadcrumbs';
import { usePerson } from '@app/hooks/usePerson';
import { Outlet, useParams } from 'react-router-dom';

export type PersonContextType = {
  person: Person;
  updatePerson: (p: Person) => void;
};

export function PersonPage() {
  const params = useParams();
  const { error, loading, person: loadedPerson, loadPerson } = usePerson(Number(params.personId));
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    loadPerson();
    setPerson(loadedPerson);
  }, []);

  useEffect(() => {
    setPerson(loadedPerson);
  }, [loadedPerson]);

  if (loading || !person) {
    return <CircularProgress />;
  }

  if (error !== '') {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <PersonBreadcrumbs person={person} />
      <Paper
        sx={{
          p: 3
        }}
      >
        <Stack spacing={2} mb={10} direction="row">
          {person.photo && <Avatar variant="rounded" src={person.photo} sx={{ width: 200, height: 200 }} />}
          <Stack spacing={2}>
            <Typography component="h1" variant="h3">
              {personName(person)}
            </Typography>
            <Typography component="h2" variant="h6">
              {personTitles(person)}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={2} mt={5}>
          <Outlet context={{ person, updatePerson: setPerson }} />
        </Stack>
      </Paper>
    </Stack>
  );
}
