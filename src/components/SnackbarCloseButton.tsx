import { Button, IconButton, Slide } from '@mui/material';
import { ProviderContext, SnackbarKey, useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';

export function enqueueEntitySavedSnackbar(enqueueSnackbar: ProviderContext['enqueueSnackbar'], message: string) {
  enqueueSnackbar(message, {
    action: SnackbarCloseButton,
    variant: 'success',
    autoHideDuration: 1800,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right'
    },
    TransitionComponent: Slide
  });
}

export function SnackbarCloseButton(key: SnackbarKey) {
  const { closeSnackbar } = useSnackbar();
  return (
    <Button onClick={() => closeSnackbar(key)}>
      <IconButton color="default" aria-label="close button" component="span" size="small">
        <CloseIcon />
      </IconButton>
    </Button>
  );
}
