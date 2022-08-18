import { ProjectsApi } from '@app/api/ProjectsApi';
import { useQuery } from 'react-query';

export function useProject(id: number) {
  return useQuery(['projects', id], async () => ProjectsApi.get(id));
}
