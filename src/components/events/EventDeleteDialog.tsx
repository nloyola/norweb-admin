import { EventUpdate } from '@app/models/events';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Box } from '@mui/system';

interface EventDeleteDialogProps {
  event: EventUpdate;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const EventDeleteDialog: React.FC<EventDeleteDialogProps> = ({ event, open, onOk, onCancel }) => {
  const handleOk = () => {
    onOk();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog onClose={handleCancel} open={open} maxWidth="md">
      <DialogTitle>Confirm event deletion</DialogTitle>
      <DialogContent>
        <Typography component="div">
          Are you sure you want to delete the event titled{' '}
          <Box fontWeight="fontWeightMedium" display="inline" sx={{ color: 'warning.main' }}>
            {event.title}
          </Box>
          ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};
