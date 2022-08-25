import { ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { Box } from '@mui/system';
import { DeleteDialog } from '../DeleteDialog';

interface ProjectKeywordDeleteDialogProps {
  keyword: ProjectKeywordUpdate;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export function ProjectKeywordDeleteDialog({ keyword, open, onOk, onCancel }: ProjectKeywordDeleteDialogProps) {
  return (
    <DeleteDialog title="Confirm keyword deletion" onOk={onOk} onCancel={onCancel} open={open}>
      <>
        Are you sure you want to delete the keyword named{' '}
        <Box fontWeight="fontWeightMedium" display="inline" sx={{ color: 'warning.main' }}>
          {keyword.name}
        </Box>
        ?
      </>
    </DeleteDialog>
  );
}
