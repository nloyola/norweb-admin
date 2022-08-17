import { FundersService } from '@app/services/funders/FundersService';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { ArrowBack } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Box, CircularProgress, Fab, Pagination, Stack, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SearchTermInput } from '../SearchTermInput';
import { ShowError } from '../ShowError';
import { ProjectFundersTable } from './ProjectFundersTable';

export function ProjectFundersList() {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1', search: '' });
  const navigate = useNavigate();

  const params = useParams();
  const projectId = Number(params.projectId);

  const paramsPage = searchParams.get('page');
  const [page, setPage] = useState(paramsPage ? Number(paramsPage) : 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search'));

  const {
    error,
    isError,
    isLoading,
    isFetching,
    data: pagination
  } = useQuery(
    ['projects', projectId, 'funders', page, searchTerm],
    () => ProjectsService.paginateFunders(projectId, page, searchTerm || ''),
    {
      keepPreviousData: true
    }
  );

  useEffect(() => {
    const params: any = {};

    if (page > 1) {
      params['page'] = `${page}`;
    }

    if (searchTerm && searchTerm !== '') {
      params['search'] = searchTerm;
    }
    setSearchParams(params);
  }, [page, searchTerm]);

  const handlePageChange = (_funder: ChangeEvent<unknown>, newPage: number) => {
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

  if (isError) {
    return <ShowError error={error} />;
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
      {(isLoading || !pagination) && <CircularProgress />}
      {!isLoading && pagination && (
        <>
          <ProjectFundersTable projectFunders={pagination.results || []} />
          {pagination.pages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2
              }}
            >
              <Pagination
                count={pagination.pages}
                page={page}
                boundaryCount={2}
                onChange={handlePageChange}
                disabled={isFetching}
              />
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
