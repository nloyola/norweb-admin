import { ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Box } from '@mui/system';

interface ProjectKeywordDeleteDialogProps {
  keyword: ProjectKeywordUpdate;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export function ProjectKeywordDeleteDialog({ keyword, open, onOk, onCancel }: ProjectKeywordDeleteDialogProps) {
  const handleOk = () => {
    onOk();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog onClose={handleCancel} open={open} maxWidth="md">
      <DialogTitle>Confirm keyword deletion</DialogTitle>
      <DialogContent>
        <Typography component="div">
          Are you sure you want to delete the keyword named{' '}
          <Box fontWeight="fontWeightMedium" display="inline">
            {keyword.name}
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
}
