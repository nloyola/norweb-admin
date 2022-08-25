import { ProjectFunderUpdate } from '@app/models/projects/ProjectFunder';
import { Box } from '@mui/system';
import { DeleteDialog } from '../DeleteDialog';

interface ProjectFunderDeleteDialogProps {
  funder: ProjectFunderUpdate;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export function ProjectFunderDeleteDialog({ funder, open, onOk, onCancel }: ProjectFunderDeleteDialogProps) {
  return (
    <DeleteDialog title="Confirm project funder deletion" onOk={onOk} onCancel={onCancel} open={open}>
      <>
        Are you sure you want to delete this project's funder named{' '}
        <Box fontWeight="fontWeightMedium" display="inline" sx={{ color: 'warning.main' }}>
          {funder.title}
        </Box>
        ?
      </>
    </DeleteDialog>
  );
}
