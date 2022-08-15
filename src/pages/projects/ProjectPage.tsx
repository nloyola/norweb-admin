import { ProjectBreadcrumbs } from '@app/components/Breadcrumbs/ProjectBreadcrumbs';
import { ShowError } from '@app/components/ShowError';
import { useProject } from '@app/hooks/useProject';
import { Project } from '@app/models/projects';
import { stringAvatar } from '@app/utils/utils';
import { Avatar, CircularProgress, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Link, Outlet, useParams } from 'react-router-dom';

export type ProjectContextType = {
  project: Project;
  updateProject: (p: Project) => void;
};

export function ProjectPage() {
  const params = useParams();
  const { isError, error, isLoading, data: project } = useProject(Number(params.projectId));

  let currentTab = 'settings';
  if (location.pathname.includes('events')) {
    currentTab = 'events';
  }

  if (isError) {
    return <ShowError error={error} />;
  }

  if (isLoading || !project) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={1}>
      <ProjectBreadcrumbs projectId={project.id} />
      <Stack spacing={1} pt={5} direction="row">
        {project.name && <Avatar {...stringAvatar(project.name)}></Avatar>}
        <Stack spacing={0}>
          <Typography component="h1" variant="h3">
            {project.name}
          </Typography>
          <Typography component="h2" variant="subtitle1">
            {project.shorthand}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Paper
        sx={{
          p: 3
        }}
      >
        <Stack spacing={2}>
          <Box mb={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab}>
              <Tab label="Settings" value="settings" component={Link} to="" />
              <Tab label="Events" value="events" component={Link} to="events" />
            </Tabs>
          </Box>
          <Outlet />
        </Stack>
      </Paper>
    </Stack>
  );
}
