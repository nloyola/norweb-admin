import { ProjectEventsApi } from '@app/api/ProjectEventsApi';
import { useQuery } from 'react-query';

export function useEvent(projectId: number, eventId: number) {
  return useQuery(['projects', projectId, 'events', eventId], async () => ProjectEventsApi.get(projectId, eventId));
}
