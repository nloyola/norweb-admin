import { Box, Fab, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PeopleSearchableTable } from '@app/components/people/PeopleSearchableTable';

export function PeoplePage() {
  return (
    <>
      <Stack spacing={2} mb={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography component="h1" variant="h4">
            People
          </Typography>
          <Fab color="primary" size="small" aria-label="add" variant="extended">
            <AddIcon sx={{ mr: 1 }} />
            Add
          </Fab>
        </Box>
      </Stack>
      <PeopleSearchableTable />
    </>
  );
}
