import { Box, Fab, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { FundersList } from '@app/components/Funders/FundersList';

// FIXME: invalidate react query cache for funders on funder add and update

/**
 * The page shown to the user when "Funders' is selected from the dashboard menu.
 */
export function FundersPage() {
  return (
    <>
      <Stack spacing={2} mb={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography component="h1" variant="h4">
            Funders
          </Typography>
          <Fab component={Link} to="add" color="primary" size="small" aria-label="add" variant="extended">
            <AddIcon sx={{ mr: 1 }} />
            Add
          </Fab>
        </Box>
      </Stack>
      <FundersList />
    </>
  );
}
