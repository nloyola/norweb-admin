import { Project } from '@app/models/projects';
import { Alert, Avatar, CircularProgress, Divider, Fab, Paper, Stack, Tab, Typography } from '@mui/material';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { stringAvatar } from '@app/utils/utils';
import { TabContext, TabList } from '@mui/lab';
import { Box } from '@mui/system';

export type ProjectContextType = {
    project: Project;
    setProject: (p: Project) => void;
};

export const ProjectContext = createContext<Partial<ProjectContextType>>({});

export function ProjectPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [project, setProject] = useState<Project | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [tab, setTab] = useState(location.pathname.includes('events') ? '2' : '1');

    const handleTabChange = (_event: React.SyntheticEvent, newTab: string) => {
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

    if (!project || !project.name) {
        navigate('../');
    }

    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            {loading && <CircularProgress />}
            {!loading && error !== '' && <Alert severity="error">{error}</Alert>}
            {!loading && error === '' && project === undefined && (
                <Alert severity="error">Project does not exist</Alert>
            )}
            {!loading && error === '' && project !== undefined && (
                <Stack spacing={2}>
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
                    <Stack spacing={2}>
                        <Paper
                            sx={{
                                p: 3
                            }}
                        >
                            <TabContext value={tab}>
                                <Box mb={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleTabChange} aria-label="project-tabs">
                                        <Tab label="Settings" value="1" component={Link} to="" />
                                        <Tab label="Events" value="2" component={Link} to="events" />
                                    </TabList>
                                </Box>
                                <Outlet />
                            </TabContext>
                        </Paper>
                    </Stack>
                </Stack>
            )}
        </ProjectContext.Provider>
    );
}
