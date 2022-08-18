import { FundersApi } from '@app/api/FundersApi';
import { useQuery } from 'react-query';

export function useFunder(id: number) {
  return useQuery(['funders', id], async () => FundersApi.get(id));
}
