import { FunderUpdate } from '@app/models/funders';
import { Box } from '@mui/system';
import { DeleteDialog } from '../DeleteDialog';

interface FunderDeleteDialogProps {
  funder: FunderUpdate;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const FunderDeleteDialog: React.FC<FunderDeleteDialogProps> = ({ funder, open, onOk, onCancel }) => {
  return (
    <DeleteDialog title="Confirm funder deletion" onOk={onOk} onCancel={onCancel} open={open}>
      <>
        Are you sure you want to delete the funder named{' '}
        <Box fontWeight="fontWeightMedium" display="inline" sx={{ color: 'warning.main' }}>
          {funder.name}
        </Box>
        ?
      </>
    </DeleteDialog>
  );
};
