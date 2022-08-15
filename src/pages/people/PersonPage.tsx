import { PersonBreadcrumbs } from '@app/components/Breadcrumbs/PersonBreadcrumbs';
import { ShowError } from '@app/components/ShowError';
import { usePerson } from '@app/hooks/usePerson';
import { Person, personName, personTitles } from '@app/models/people';
import { Avatar, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { Outlet, useParams } from 'react-router-dom';

export type PersonContextType = {
  person: Person;
  updatePerson: (p: Person) => void;
};

export function PersonPage() {
  const params = useParams();
  const { isError, error, isLoading, data: person } = usePerson(Number(params.personId));

  if (isError) {
    return <ShowError error={error} />;
  }

  if (isLoading || !person) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={2}>
      <PersonBreadcrumbs personId={person.id} />
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
          <Outlet />
        </Stack>
      </Paper>
    </Stack>
  );
}
