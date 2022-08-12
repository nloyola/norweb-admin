import { PaginatedResponse } from '@app/models';
import { useCallback, useState } from 'react';

type PaginationData<T> = {
  pagedResults?: PaginatedResponse<T>;
  count: number;
};

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

export function usePaginator<T>(
  paginationFetcher: (page: number, searchTerm: string) => Promise<PaginatedResponse<T>>
) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData<T> | null>(null);

  const loadPage = useCallback((page: number, searchTerm: string) => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // use this for testing delay
        // await new Promise((r) => setTimeout(r, 2000));
        const pg = await paginationFetcher(page, searchTerm);

        setPagination({
          pagedResults: pg,
          count: pg.next ? Math.ceil(pg.total / pg.results.length) : page
        });
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          if (err.message.includes('Not found')) {
            setPagination(null);
          } else {
            setError(JSON.stringify(err));
          }
        } else {
          setError(JSON.stringify(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { error, loading, pagination, loadPage };
}
