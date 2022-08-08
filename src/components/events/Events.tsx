import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, CircularProgress, Fab, Stack, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { EventsTable } from './EventsTable';
import { SearchTermInput } from '../SearchTermInput';
import { useProjectEvents } from '@app/hooks/useProjectEvents';

export function Events() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  // const [events, setEvents] = useState<Event[]>([]);

  const projectId = Number(params.projectId);
  const { error, loading, pagination, loadEvents } = useProjectEvents(projectId, 1, '');

  useEffect(loadEvents, []);

  // useEffect(() => {
  //   const filteredEvents = project?.events.filter((e) => e.title.toLowerCase().includes(searchTerm)) || [];
  //   setEvents(filteredEvents);
  // }, [searchTerm]);

  const handleSearchTermChange = (input: string) => {
    setSearchTerm(input);
  };

  const handleAddClicked = () => {
    navigate('add');
  };

  const backClicked = () => {
    navigate(-2);
  };

  if (loading || !pagination) {
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
          <SearchTermInput initialInput={searchTerm} onChange={handleSearchTermChange} />
        </Box>
      </Stack>
      <EventsTable events={pagination?.results || []} />
      <Stack spacing={2} direction="row" mt={5}>
        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
          <ArrowBack sx={{ mr: 1 }} />
          Back
        </Fab>
      </Stack>
    </>
  );
}
