import { ResearchAreaUpdate } from '@app/models/researchAreas';
import { Box } from '@mui/system';
import { DeleteDialog } from '../DeleteDialog';

interface ResearchAreaDeleteDialogProps {
  area: ResearchAreaUpdate;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const ResearchAreaDeleteDialog: React.FC<ResearchAreaDeleteDialogProps> = ({ area, open, onOk, onCancel }) => {
  return (
    <DeleteDialog title="Confirm researchArea deletion" onOk={onOk} onCancel={onCancel} open={open}>
      <>
        Are you sure you want to delete the research area named{' '}
        <Box fontWeight="fontWeightMedium" display="inline" sx={{ color: 'warning.main' }}>
          {area.name}
        </Box>
        ?
      </>
    </DeleteDialog>
  );
};
