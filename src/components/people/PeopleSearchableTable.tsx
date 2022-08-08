import { Box, Stack, Alert, CircularProgress, Pagination } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PaginatedResponse } from '@app/models';
import { PeopleService } from '@app/services/people/PeopleService';
import { PeopleTable } from './PeopleTable';
import { Person } from '@app/models/people';
import { SearchTermInput } from '../SearchTermInput';

type PaginationData = {
  pagedResults?: PaginatedResponse<Person>;
  count: number;
};

export function PeopleSearchableTable() {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1', search: '' });
  const paramsPage = searchParams.get('page');

  const [page, setPage] = useState(paramsPage ? Number(paramsPage) : 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search'));

  const [data, setData] = useState<PaginationData>({ count: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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
    const fetchData = async () => {
      const params: any = {};

      if (page > 1) {
        params['page'] = `${page}`;
      }

      if (searchTerm && searchTerm !== '') {
        params['search'] = searchTerm;
      }
      setSearchParams(params);

      setLoading(true);
      try {
        // if response.next is NULL, then user is on LAST PAGE
        const pagedResults = await PeopleService.paginate(page, searchTerm || '');
        setData({
          ...data,
          pagedResults,
          count: pagedResults.next ? Math.ceil(pagedResults.total / pagedResults.results.length) : page
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, searchTerm]);

  return (
    <>
      <Stack spacing={2} mb={2}>
        <SearchTermInput initialInput={searchTerm} onChange={handleSearchTermChange} />
        {!loading && error !== '' && <Alert severity="error">{error}</Alert>}
        {loading && <CircularProgress />}
        {!loading && error === '' && (
          <>
            <PeopleTable people={data.pagedResults?.results || []} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                mt: 2
              }}
            >
              <Pagination count={data.count} page={page} boundaryCount={2} onChange={handlePageChange} />
            </Box>
          </>
        )}
      </Stack>
    </>
  );
}
