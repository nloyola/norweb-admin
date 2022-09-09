import { ResearchArea } from '@app/models/projects/ResearchArea';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

export const ResearchAreaInUseDialog: React.FC<{
  area: ResearchArea;
  open: boolean;
  onOk: () => void;
}> = ({ area, open, onOk }) => {
  const handleOk = () => {
    onOk();
  };

  return (
    <Dialog onClose={handleOk} open={open} maxWidth="md">
      <DialogTitle>Cannot Delete Research Area</DialogTitle>
      <DialogContent>
        <p>
          The research area named{' '}
          <Box fontWeight="fontWeightMedium" display="inline" sx={{ color: 'warning.main' }}>
            {area.name}
          </Box>{' '}
          is currently in use by one or more Projects and cannot be deleted.
        </p>
        <p>This research area must first be removed from the projects it is used in, and then can be deleted.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};
