import { FunderBreadcrumbs } from '@app/components/Breadcrumbs/FunderBreadcrumbs';
import { ShowError } from '@app/components/ShowError';
import { useFunder } from '@app/hooks/useFunder';
import { Funder } from '@app/models/funders';
import { CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Outlet, useParams } from 'react-router-dom';

export type FunderContextType = {
  funder: Funder;
  updateFunder: (p: Funder) => void;
};

export function FunderPage() {
  const params = useParams();
  const { isError, error, isLoading, data: funder } = useFunder(Number(params.funderId));

  if (isError) {
    return <ShowError error={error} />;
  }

  if (isLoading || !funder) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={1}>
      <FunderBreadcrumbs funderId={funder.id} />
      <Stack spacing={1} pt={5} direction="row">
        <Stack spacing={0}>
          <Typography component="h1" variant="h3">
            {funder.name}
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Paper
        sx={{
          p: 3
        }}
      >
        <Stack spacing={2}>
          <Box mb={3}>
            {/*
            <Tabs value={currentTab}>
              <Tab label="Settings" value="settings" component={Link} to="" />
              <Tab label="Events" value="events" component={Link} to="events" />
            </Tabs>
        */}
          </Box>
          <Outlet />
        </Stack>
      </Paper>
    </Stack>
  );
}
