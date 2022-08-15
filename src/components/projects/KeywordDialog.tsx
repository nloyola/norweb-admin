import { ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  weight: z
    .preprocess((a) => parseFloat(z.string().parse(a)), z.number().min(0).max(1))
    .refine((number) => /^\d(\.\d{1,5})?$/.test(`${number}`), {
      message: 'can only have a maximum of 5 digits after the decimal'
    })
});

export type KeywordFormInput = z.infer<typeof schema>;

type KeywordsDialogProps = {
  keyword?: ProjectKeywordUpdate;
  open: boolean;
  onClose: (keyword?: KeywordFormInput) => void;
};

/**
 * A component that allows the user to update a project keyword.
 *
 * Opens up a dialog box that allows the user to modify the keyword settings.
 */
export function KeywordDialog({ keyword, open, onClose }: KeywordsDialogProps) {
  const {
    control,
    getValues,
    formState: { isValid, errors }
  } = useForm<KeywordFormInput>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: { name: keyword?.name || '', weight: keyword?.weight || 0 }
  });

  console.log(getValues());

  const handleOk = () => {
    onClose(getValues());
  };

  const handleCancel = () => {
    onClose();
  };

  const title = keyword ? 'Update keyword' : 'Add keyword';

  if (open) {
    return (
      <Dialog onClose={handleCancel} open={open} fullWidth={true} maxWidth="md">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form>
              <Grid container spacing={3}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Grid item xs={6} md={6}>
                      <TextField
                        {...field}
                        label="Keyword name"
                        variant="standard"
                        error={!!errors.name}
                        helperText={errors.name ? errors.name?.message : ''}
                        fullWidth
                        margin="dense"
                      />
                    </Grid>
                  )}
                />
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <Grid item xs={6} md={6}>
                      <TextField
                        {...field}
                        label="Weight"
                        type="number"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9.]*', min: 0, max: 1, step: '0.05' }}
                        variant="standard"
                        error={!!errors.weight}
                        helperText={errors.weight ? errors.weight?.message : ''}
                        fullWidth
                        margin="dense"
                      />
                    </Grid>
                  )}
                />
              </Grid>
            </form>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleOk} disabled={!isValid}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return <></>;
}
