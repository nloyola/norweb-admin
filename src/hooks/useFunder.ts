import { FundersService } from '@app/services/funders/FundersService';
import { useQuery } from 'react-query';

export function useFunder(id: number) {
  return useQuery(['funders', id], async () => FundersService.get(id));
}
