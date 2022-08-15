import { Box, Fab, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { ProjectsSearchableTable } from '@app/components/projects/ProjectsSearchableTable';

// FIXME: invalidate react query cache for projects on project add and update
// FIXME: invalidate react query cache for events on event add and update

/**
 * The page shown to the user when "Projects' is selected from the dashboard menu.
 */
export function ProjectsPage() {
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
            Projects
          </Typography>
          <Fab component={Link} to="add" color="primary" size="small" aria-label="add" variant="extended">
            <AddIcon sx={{ mr: 1 }} />
            Add
          </Fab>
        </Box>
      </Stack>
      <ProjectsSearchableTable />
    </>
  );
}
