import { Event } from '@app/models/events';
import { EventsService } from '@app/services/events/EventsService';
import { useCallback, useState } from 'react';

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

export function useEvent(projectId: number | undefined, eventId: number) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [serverData, setServerData] = useState<Event | undefined>(undefined);

    const loadEvent = useCallback(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            if (!projectId) {
                return null;
            }

            try {
                // use this when testing
                // await new Promise((r) => setTimeout(r, 2000));
                const event = await EventsService.get(projectId, eventId);
                setServerData(event);
                setLoading(false);
                return event;
            } catch (err) {
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId, eventId]);

    return { error, loading, event: serverData, loadEvent };
}
