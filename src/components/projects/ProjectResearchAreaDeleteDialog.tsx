import { ProjectResearchArea } from '@app/models/projects/ProjectResearchArea';
import { Box } from '@mui/system';
import { DeleteDialog } from '../DeleteDialog';

interface ProjectFunderDeleteDialogProps {
  area?: ProjectResearchArea;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export function ProjectResearchAreaDeleteDialog({ area, open, onOk, onCancel }: ProjectFunderDeleteDialogProps) {
  return (
    <DeleteDialog title="Confirm research area deletion" onOk={onOk} onCancel={onCancel} open={open}>
      <>
        Are you sure you want to remove the research area named{' '}
        <Box fontWeight="fontWeightMedium" display="inline" sx={{ color: 'warning.main' }}>
          {area?.researchArea?.name}
        </Box>
        ?
      </>
    </DeleteDialog>
  );
}
