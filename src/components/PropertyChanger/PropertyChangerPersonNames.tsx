import { Grid, TextField } from '@mui/material';
import { useState } from 'react';
import { PersonNames, PropertyChangerPersonNamesProps, PropertyChangerProps } from './PropertyChanger';
import * as yup from 'yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PropertyChangerDialog } from './PropertyChangerDialog';

const schema = yup.object().shape({
  givenNames: yup.string(),
  familyNames: yup.string().required('at least one family name is required')
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
    resolver: yupResolver(schema),
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
