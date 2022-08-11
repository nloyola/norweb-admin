import { EventsService } from '@app/services/events/EventsService';
import { usePaginator } from './usePaginator';

/**
 * Retrieves a list of events belonging to a project from the backend.
 *
 * The events are returned in a paginated fashion. See {@link PaginationData}.
 */
export function useProjectEvents(projectId: number) {
  return usePaginator((page: number, searchTerm: string) => EventsService.paginate(projectId, page, searchTerm));
}
