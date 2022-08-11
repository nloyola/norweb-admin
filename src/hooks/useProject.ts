import { ProjectsService } from '@app/services/projects/ProjectsService';
import { useEntity } from './useEntity';

// see https://betterprogramming.pub/fetching-data-with-react-72df95683c70

export function useProject(id: number) {
  const { error, loading, entity, loadEntity } = useEntity(() => ProjectsService.get(id));
  return { error, loading, project: entity, loadProject: loadEntity };
}
