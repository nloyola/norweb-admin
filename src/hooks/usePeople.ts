import { PaginatedResponse } from '@app/models';
import { Person } from '@app/models/people';
import { PeopleService } from '@app/services/people/PeopleService';
import { useCallback, useState } from 'react';

type PaginationData = {
  pagedResults?: PaginatedResponse<Person>;
  count: number;
};

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

/**
 * Loads a list of people from the backend.
 *
 * The people are returned in a paginated fashion. See {@link PaginationData}.
 */
export function usePeople() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const loadPeople = useCallback((page: number, searchTerm: string) => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // use this for testing delay
        // await new Promise((r) => setTimeout(r, 2000));
        const pg = await PeopleService.paginate(page, searchTerm);
        setPagination({
          pagedResults: pg,
          count: pg.next ? Math.ceil(pg.total / pg.results.length) : page
        });
      } catch (err) {
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

  return { error, loading, pagination, loadPeople };
}
