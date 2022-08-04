import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import AddIcon from '@mui/icons-material/Add';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { EventsTable } from './EventsTable';
import { useProject } from '@app/hooks/useProject';

export function Events() {
  const params = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { error, loading, project, loadProject } = useProject(Number(params.projectId));

  useEffect(loadProject, []);

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleAddClicked = () => {
    navigate('add');
  };

  const clearSearch = () => {
    setSearch('');
  };

  const backClicked = () => {
    navigate(-2);
  };

  if (loading || !project) {
    return <CircularProgress />;
  }

  if (error !== '') {
    return <Alert severity="error">{error}</Alert>;
  }

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
            &nbsp;
          </Typography>
          <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={handleAddClicked}>
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
                  <IconButton aria-label="toggle password visibility" onMouseDown={clearSearch} edge="end">
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
  );
}
