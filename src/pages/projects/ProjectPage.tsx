import { Project } from '@app/models/projects';
import { Alert, Avatar, CircularProgress, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Link, matchPath, Outlet, useLocation, useParams } from 'react-router-dom';
import { SyntheticEvent, useEffect, useState } from 'react';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { stringAvatar } from '@app/utils/utils';
import { TabContext, TabList } from '@mui/lab';
import { Box } from '@mui/system';
import { ProjectBreadcrumbs } from '@app/components/Breadcrumbs/ProjectBreadcrumbs';

export type ProjectContextType = {
  project: Project;
  updateProject: (p: Project) => void;
};

export function useRouteMatch(patterns: readonly string[]) {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = matchPath(pattern, pathname);
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }

  return null;
}

export function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  let currentTab = 'settings';
  if (location.pathname.includes('events')) {
    currentTab = 'events';
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const p = await ProjectsService.get(Number(params.projectId));
        setProject(p);
      } catch (err) {
        setError(err instanceof Error ? err.message : JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !project) {
    return <CircularProgress />;
  }

  if (error !== '') {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={1}>
      <Paper
        mb={5}
        sx={{
          p: 2
        }}
      >
        <ProjectBreadcrumbs project={project} />
      </Paper>
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
          <Outlet context={{ project, updateProject: setProject }} />
        </Stack>
      </Paper>
    </Stack>
  );
}
