import { ProjectsService } from '@app/services/projects/ProjectsService';
import { usePaginator } from './usePaginator';

/**
 * Loads a list of projects from the backend.
 *
 * The projects are returned in a paginated fashion. See {@link PaginationData}.
 */
export function useProjects() {
  return usePaginator((page: number, searchTerm: string) => ProjectsService.paginate(page, searchTerm));
}
