import { PeopleService } from '@app/services/people/PeopleService';
import { usePaginator } from './usePaginator';

/**
 * Retrieves a list of people from the backend.
 *
 * The people are returned in a paginated fashion. See {@link PaginationData}.
 */
export function usePeople() {
  return usePaginator((page: number, searchTerm: string) => PeopleService.paginate(page, searchTerm));
}
