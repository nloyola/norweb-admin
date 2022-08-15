import { PeopleService } from '@app/services/people/PeopleService';
import { useQuery } from 'react-query';

export function usePerson(id: number) {
  return useQuery(['people', id], async () => PeopleService.get(id));
}
