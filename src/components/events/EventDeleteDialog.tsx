import { EventUpdate } from '@app/models/events';
import { Box } from '@mui/system';
import { DeleteDialog } from '../DeleteDialog';

interface EventDeleteDialogProps {
  event: EventUpdate;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const EventDeleteDialog: React.FC<EventDeleteDialogProps> = ({ event, open, onOk, onCancel }) => {
  return (
    <DeleteDialog title="Confirm event deletion" onOk={onOk} onCancel={onCancel} open={open}>
      <>
        Are you sure you want to delete the event titled{' '}
        <Box fontWeight="fontWeightMedium" display="inline" sx={{ color: 'warning.main' }}>
          {event.title}
        </Box>
        ?
      </>
    </DeleteDialog>
  );
};
