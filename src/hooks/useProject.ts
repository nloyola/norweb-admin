import { Project } from '@app/models/projects';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { useCallback, useState } from 'react';

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

export function useProject(id: number) {
    const [serverData, setServerData] = useState<Project | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadProject = useCallback(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');

            try {
                // use this when testing
                // await new Promise((r) => setTimeout(r, 2000));
                const project = await ProjectsService.get(id);
                setServerData(project);
                setLoading(false);
                return project;
            } catch (err) {
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return { error, loading, project: serverData, loadProject };
}
