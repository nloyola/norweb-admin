import { ResearchAreasApi } from '@app/api/ResearchAreasApi';
import { ResearchArea } from '@app/models/projects/ResearchArea';
import { CircularProgress, Stack } from '@mui/material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ShowError } from '../ShowError';
import { ResearchAreasTable } from './ResearchAreasTable';

export function ResearchAreasList() {
  const navigate = useNavigate();

  const {
    error,
    isError,
    isLoading,
    data: researchAreas
  } = useQuery(['researchAreas'], () => ResearchAreasApi.list(), {
    keepPreviousData: true
  });

  if (isError) {
    console.log(error);
    return <ShowError error={error} />;
  }

  const handleSelected = (area: ResearchArea) => {
    navigate(`./${area.id}`);
  };

  return (
    <Stack spacing={2} mb={2}>
      {(isLoading || !researchAreas) && <CircularProgress />}
      {!isLoading && researchAreas && (
        <ResearchAreasTable researchAreas={researchAreas || []} onSelected={handleSelected} />
      )}
    </Stack>
  );
}
