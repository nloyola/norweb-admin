import { ResearchAreasApi } from '@app/api/ResearchAreasApi';
import { ResearchAreaBreadcrumbs } from '@app/components/Breadcrumbs/ResearchAreaBreadcrumbs';
import { ShowError } from '@app/components/ShowError';
import { CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useQuery } from 'react-query';
import { Outlet, useParams } from 'react-router-dom';

export function ResearchAreaPage() {
  const params = useParams();
  const areaId = Number(params.areaId);

  const {
    isError,
    error,
    isLoading,
    data: area
  } = useQuery(['research-areas', areaId], async () => ResearchAreasApi.get(areaId));

  if (isError) {
    return <ShowError error={error} />;
  }

  if (isLoading || !area) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={1}>
      <ResearchAreaBreadcrumbs areaId={area.id} />
      <Stack spacing={1} pt={5} direction="row">
        <Stack spacing={0}>
          <Typography component="h1" variant="h3">
            {area.name}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Paper
        sx={{
          py: 8,
          px: 4
        }}
      >
        <Box mt={5} mx={3}>
          <Outlet />
        </Box>
      </Paper>
    </Stack>
  );
}
