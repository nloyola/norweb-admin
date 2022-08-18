import { Box, Stack, Alert, CircularProgress, Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProjectsTable } from './ProjectsTable';
import { SearchTermInput } from '../SearchTermInput';
import { useQuery } from 'react-query';
import { ProjectsApi } from '@app/api/ProjectsApi';
import { ShowError } from '../ShowError';

export function ProjectsSearchableTable() {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1', search: '' });
  const paramsPage = searchParams.get('page');
  const [page, setPage] = useState(paramsPage ? Number(paramsPage) : 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const {
    error,
    isError,
    isLoading,
    isFetching,
    data: pagination
  } = useQuery(['projects', page, searchTerm], () => ProjectsApi.paginate(page, searchTerm), {
    keepPreviousData: true
  });

  const handlePageChange = (_event: ChangeEvent<unknown>, newPage: number) => {
    if (page !== newPage) {
      setPage(newPage);
    }
  };

  const handleSearchTermChange = (input: string) => {
    setSearchTerm(input);
    setPage(1);
  };

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

  if (isError) {
    return <ShowError error={error} />;
  }

  return (
    <Stack spacing={2} mb={2}>
      <SearchTermInput initialInput={searchTerm} onChange={handleSearchTermChange} />
      {(isLoading || !pagination) && <CircularProgress />}
      {!isLoading && pagination && (
        <>
          <ProjectsTable projects={pagination?.results || []} />
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
    </Stack>
  );
}
