import { Project } from '@app/models/projects';
import { Alert, Avatar, CircularProgress, Divider, Paper, Stack, Tab, Typography } from '@mui/material';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { SyntheticEvent, useEffect, useState } from 'react';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { stringAvatar } from '@app/utils/utils';
import { TabContext, TabList } from '@mui/lab';
import { Box } from '@mui/system';

export type ProjectContextType = {
  project: Project;
  updateProject: (p: Project) => void;
};

export function ProjectPage() {
  const location = useLocation();
  const params = useParams();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [tab, setTab] = useState(location.pathname.includes('events') ? '2' : '1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleTabChange = (_event: SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

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
      <Stack spacing={1} direction="row">
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
          <TabContext value={tab}>
            <Box mb={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleTabChange} aria-label="project-tabs">
                <Tab label="Settings" value="1" component={Link} to="" />
                <Tab label="Events" value="2" component={Link} to="events" />
              </TabList>
            </Box>
            <Outlet context={{ project, updateProject: setProject }} />
          </TabContext>
        </Stack>
      </Paper>
    </Stack>
  );
}
