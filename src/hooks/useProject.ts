import { ProjectsService } from '@app/services/projects/ProjectsService';
import { useQuery } from 'react-query';

export function useProject(id: number) {
  return useQuery(['projects', id], async () => ProjectsService.get(id));
}
