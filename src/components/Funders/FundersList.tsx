import { FundersApi } from '@app/api/FundersApi';
import { CircularProgress, Pagination, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { ChangeEvent, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { SearchTermInput } from '../SearchTermInput';
import { ShowError } from '../ShowError';
import { FundersTable } from './FundersTable';

export function FundersList() {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1', search: '' });
  const paramsPage = searchParams.get('page');

  const [page, setPage] = useState(paramsPage ? Number(paramsPage) : 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search'));

  const {
    error,
    isError,
    isLoading,
    isFetching,
    data: pagination
  } = useQuery(['funders', page, searchTerm], () => FundersApi.paginate(page, searchTerm || ''), {
    keepPreviousData: true
  });

  const handlePageChange = (_event: ChangeEvent<unknown>, newPage: number) => {
    if (page !== newPage) {
      setPage(newPage);
    }
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

  const handleSearchTermChange = (input: string) => {
    setSearchTerm(input);
    setPage(1);
  };

  if (isError) {
    return <ShowError error={error} />;
  }

  return (
    <Stack spacing={2} mb={2}>
      <SearchTermInput initialInput={searchTerm} onChange={handleSearchTermChange} />
      {(isLoading || !pagination) && <CircularProgress />}
      {!isLoading && pagination && (
        <>
          <FundersTable funders={pagination.results || []} />
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
