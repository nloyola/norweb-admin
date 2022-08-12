import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, TextField } from '@mui/material';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { PersonNames, PropertyChangerPersonNamesProps } from './PropertyChanger';
import { PropertyChangerDialog } from './PropertyChangerDialog';

const schema = z.object({
  givenNames: z.string(),
  familyNames: z.string().min(1, { message: 'at least one family name is required' })
});

export function PropertyChangerPersonNames({
  propertyName,
  title,
  value,
  open,
  onClose
}: PropertyChangerPersonNamesProps) {
  const [input, setInput] = useState<PersonNames | undefined>(value);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors }
  } = useForm<PersonNames>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: value
  });

  const onSubmit: SubmitHandler<PersonNames> = (data) => {
    setInput(data);
  };

  const handleOk = () => {
    onClose(propertyName, input);
  };

  const handleCancel = () => {
    onClose(propertyName, undefined);
  };

  return (
    <PropertyChangerDialog title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={isValid}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Controller
              name="givenNames"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Given names"
                  variant="standard"
                  error={!!errors.givenNames}
                  helperText={errors.givenNames ? errors.givenNames?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Controller
              name="familyNames"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Family names"
                  variant="standard"
                  error={!!errors.familyNames}
                  helperText={errors.familyNames ? errors.familyNames?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
    </PropertyChangerDialog>
  );
}
