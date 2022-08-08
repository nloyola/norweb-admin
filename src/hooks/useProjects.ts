import { PaginatedResponse } from '@app/models';
import { Project } from '@app/models/projects';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { useCallback, useState } from 'react';

type PaginationData = {
  pagedResults?: PaginatedResponse<Project>;
  count: number;
};

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

/**
 * Loads a list of projects from the backend.
 *
 * The projects are returned in a paginated fashion. See {@link PaginationData}.
 */
export function useProjects() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const loadProjects = useCallback((page: number, searchTerm: string) => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        // use this for testing delay
        // await new Promise((r) => setTimeout(r, 2000));
        const pg = await ProjectsService.paginate(page, searchTerm);
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

  return { error, loading, pagination, loadProjects };
}
