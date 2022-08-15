import { EventsService } from '@app/services/events/EventsService';
import { useQuery } from 'react-query';

export function useEvent(projectId: number, eventId: number) {
  return useQuery(['projects', projectId, 'events', eventId], async () => EventsService.get(projectId, eventId));
}
