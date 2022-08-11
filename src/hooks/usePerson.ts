import { PeopleService } from '@app/services/people/PeopleService';
import { useEntity } from './useEntity';

export function usePerson(id: number) {
  const { error, loading, entity, loadEntity } = useEntity(() => PeopleService.get(id));
  return { error, loading, person: entity, loadPerson: loadEntity };
}
