import { Project } from '@app/models/projects';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { useCallback, useState } from 'react';

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

export function useProject(id: number) {
  const [project, setProject] = useState<Project | null>(null);
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
        setProject(project);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('Not found')) {
            setProject(null);
          } else {
            setError(JSON.stringify(err));
          }
        } else {
          setError(JSON.stringify(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { error, loading, project, loadProject };
}
