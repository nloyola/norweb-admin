import { Box, Paper, Stack, Typography } from '@mui/material';
import ProjectAddForm from '@app/components/projects/ProjectAddForm';

export function ProjectAddPage() {
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
            Add a Project
          </Typography>
        </Box>

        <ProjectAddForm />
      </Stack>
    </Paper>
  );
}
