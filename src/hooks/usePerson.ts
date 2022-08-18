import { PeopleApi } from '@app/api/PeopleApi';
import { useQuery } from 'react-query';

export function usePerson(id: number) {
  return useQuery(['people', id], async () => PeopleApi.get(id));
}
