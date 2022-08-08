import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Alert, Box, CircularProgress, Fab, Pagination, Stack, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { EventsTable } from './EventsTable';
import { SearchTermInput } from '../SearchTermInput';
import { useProjectEvents } from '@app/hooks/useProjectEvents';
import AddIcon from '@mui/icons-material/Add';

export function Events() {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1', search: '' });
  const navigate = useNavigate();

  const params = useParams();
  const projectId = Number(params.projectId);

  const paramsPage = searchParams.get('page');
  const [page, setPage] = useState(paramsPage ? Number(paramsPage) : 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search'));

  const { error, loading, pagination, loadEvents } = useProjectEvents(projectId);

  useEffect(() => {
    const params: any = {};

    if (page > 1) {
      params['page'] = `${page}`;
    }

    if (searchTerm && searchTerm !== '') {
      params['search'] = searchTerm;
    }
    setSearchParams(params);

    loadEvents(page, searchTerm || '');
  }, [page, searchTerm]);

  const handlePageChange = (_event: ChangeEvent<unknown>, newPage: number) => {
    if (page !== newPage) {
      setPage(newPage);
    }
  };

  const handleSearchTermChange = (input: string) => {
    setSearchTerm(input);
    setPage(1);
  };

  const handleAddClicked = () => {
    navigate('add');
  };

  const backClicked = () => {
    // tried using -1 and -2 but they do not work correctly, sometimes they do nothing
    navigate('../../');
  };

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
      {(loading || !pagination) && <CircularProgress />}
      {!loading && pagination && (
        <>
          <EventsTable events={pagination.pagedResults?.results || []} />
          {pagination.count > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2
              }}
            >
              <Pagination count={pagination.count || 1} page={page} boundaryCount={2} onChange={handlePageChange} />
            </Box>
          )}
        </>
      )}
      <Stack spacing={2} direction="row" mt={5}>
        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
          <ArrowBack sx={{ mr: 1 }} />
          Back
        </Fab>
      </Stack>
    </>
  );
}
