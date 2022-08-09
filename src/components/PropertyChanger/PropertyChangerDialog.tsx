import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ReactNode } from 'react';

interface PropertyChangerDialogProps {
  children: ReactNode;
  title: string;
  open: boolean;
  valid: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export function PropertyChangerDialog({ title, open, valid, onOk, onCancel, children }: PropertyChangerDialogProps) {
  const handleOk = () => {
    onOk();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog onClose={handleCancel} open={open} fullWidth={true} maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk} disabled={!valid}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
