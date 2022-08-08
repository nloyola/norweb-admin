import { PaginatedResponse } from '@app/models';
import { Event } from '@app/models/events';
import { EventsService } from '@app/services/events/EventsService';
import { useCallback, useState } from 'react';

type PaginationData = {
  pagedResults?: PaginatedResponse<Event>;
  count: number;
};

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

export function useProjectEvents(projectId: number) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const loadEvents = useCallback(
    (page: number, searchTerm: string) => {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        if (!projectId) {
          return null;
        }

        try {
          // use this for testing delay
          // await new Promise((r) => setTimeout(r, 2000));
          const pg = await EventsService.paginate(projectId, page, searchTerm);
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
    },
    [projectId]
  );

  return { error, loading, pagination, loadEvents };
}
