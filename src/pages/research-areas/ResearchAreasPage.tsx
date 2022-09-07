import { Box, Fab, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { ResearchAreasList } from '@app/components/ResearchAreas/ResearchAreasList';

/**
 * The page shown to the user when "ResearchAreas' is selected from the dashboard menu.
 */
export function ResearchAreasPage() {
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
            Research areas
          </Typography>
          <Fab component={Link} to="add" color="primary" size="small" aria-label="add" variant="extended">
            <AddIcon sx={{ mr: 1 }} />
            Add
          </Fab>
        </Box>
      </Stack>
      <ResearchAreasList />
    </>
  );
}
