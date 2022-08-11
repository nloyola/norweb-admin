import { useFunders } from '@app/hooks/useFunders';
import { Alert, CircularProgress, Pagination, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchTermInput } from '../SearchTermInput';
import { FundersTable } from './FundersTable';

export function FundersList() {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1', search: '' });
  const paramsPage = searchParams.get('page');

  const [page, setPage] = useState(paramsPage ? Number(paramsPage) : 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search'));

  const { error, loading, pagination, loadPage } = useFunders();

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

    loadPage(page, searchTerm || '');
  }, [page, searchTerm]);

  const handleSearchTermChange = (input: string) => {
    setSearchTerm(input);
    setPage(1);
  };

  if (error !== '') {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={2} mb={2}>
      <SearchTermInput initialInput={searchTerm} onChange={handleSearchTermChange} />
      {(loading || !pagination) && <CircularProgress />}
      {!loading && pagination && (
        <>
          <FundersTable funders={pagination.pagedResults?.results || []} />
          {pagination.count > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2
              }}
            >
              <Pagination count={pagination.count} page={page} boundaryCount={2} onChange={handlePageChange} />
            </Box>
          )}
        </>
      )}
    </Stack>
  );
}
