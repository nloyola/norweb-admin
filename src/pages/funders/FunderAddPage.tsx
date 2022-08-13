import { Box, Paper, Stack, Typography } from '@mui/material';
import { FunderAddForm } from '@app/components/Funders/FunderAddForm';

export function FunderAddPage() {
  return (
    <Paper
      sx={{
        p: 3
      }}
    >
      <Stack spacing={2} mb={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography component="h1" variant="h4">
            Add a Funder
          </Typography>
        </Box>
        <FunderAddForm />
      </Stack>
    </Paper>
  );
}
3;
