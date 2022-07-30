import { useContext, useEffect, useState } from 'react';
import { ProjectContext } from '@app/pages/projects/ProjectPage';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    CircularProgress,
    Fab,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Project } from '@app/models/projects';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { EventsTable } from './EventsTable';

export function Events() {
    const navigate = useNavigate();
    const { project, setProject } = useContext(ProjectContext);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleAddClicked = () => {
        navigate('add');
    };

    const clearSearch = () => {
        setSearch('');
    };

    const backClicked = () => {
        navigate('../../..');
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!project.id) {
                return;
            }

            setLoading(true);
            try {
                const raw = await ProjectsService.get(project.id);
                const p = new Project().deserialize(raw);
                setProject(p);
            } catch (err) {
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            {loading && <CircularProgress />}
            {!loading && error !== '' && <Alert severity="error">{error}</Alert>}
            {!loading && error === '' && (
                <>
                    <Stack spacing={2} mb={2}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Typography component="h1" variant="h4">
                                &nbsp;
                            </Typography>
                            <Fab
                                color="primary"
                                size="small"
                                aria-label="add"
                                variant="extended"
                                onClick={handleAddClicked}
                            >
                                <AddIcon sx={{ mr: 1 }} />
                                Add
                            </Fab>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <TextField
                                label="Search"
                                value={search}
                                onChange={handleSearchTermChange}
                                fullWidth
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onMouseDown={clearSearch}
                                                edge="end"
                                            >
                                                <HighlightOffSharpIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    </Stack>
                    <EventsTable events={project.events} />
                    <Stack spacing={2} direction="row" mt={5}>
                        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
                            <ArrowBack sx={{ mr: 1 }} />
                            Back
                        </Fab>
                    </Stack>
                </>
            )}
        </>
    );
}
