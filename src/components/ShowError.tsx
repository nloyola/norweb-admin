import { Alert } from '@mui/material';

export const ShowError: React.FC<{ error: any }> = ({ error }) => {
  return (
    <Alert severity="error">
      Error
      <pre>{JSON.stringify((error as any).message, null, 2)}</pre>
    </Alert>
  );
};
