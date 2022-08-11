import { FundersService } from '@app/services/funders/FundersService';
import { useEntity } from './useEntity';

export function useFunder(id: number) {
  const { error, loading, entity, loadEntity } = useEntity(() => FundersService.get(id));
  return { error, loading, funder: entity, loadFunder: loadEntity };
}
