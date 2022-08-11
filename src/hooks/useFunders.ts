import { FundersService } from '@app/services/funders/FundersService';
import { usePaginator } from './usePaginator';

/**
 * Loads a list of funders from the backend.
 *
 * The funders are returned in a paginated fashion. See {@link PaginationData}.
 */
export function useFunders() {
  return usePaginator((page: number, searchTerm: string) => FundersService.paginate(page, searchTerm));
}
