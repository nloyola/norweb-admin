import { EventsService } from '@app/services/events/EventsService';
import { useEntity } from './useEntity';

export function useEvent(projectId: number, eventId: number) {
  const { error, loading, entity, loadEntity, updateEntity } = useEntity(() => EventsService.get(projectId, eventId));
  return { error, loading, event: entity, loadEvent: loadEntity, updateEvent: updateEntity };
}
