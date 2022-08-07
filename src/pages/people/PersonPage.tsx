import { Stack } from '@mui/material';
import { PersonBio } from '@app/components/people/PersonBio';

export function PersonPage() {
  return (
    <Stack spacing={2}>
      <PersonBio />
    </Stack>
  );
}
