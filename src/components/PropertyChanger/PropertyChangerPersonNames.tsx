import { Grid, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { PropertyChanger, PropertyChangerProps } from './PropertyChanger';
import * as yup from 'yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export interface PersonNames {
  givenNames: string;
  legalNames: string;
}

const schema = yup.object().shape({
  givenNames: yup.string(),
  legalNames: yup.string().required('at least one family name is required')
});

export interface PropertyChangerPersonNamesProps extends PropertyChangerProps<PersonNames> {}

export function PropertyChangerPersonNames({ title, id, value, open, onClose }: PropertyChangerPersonNamesProps) {
  const [valueState, setValueState] = useState<PersonNames | undefined>(value);

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
    setValueState(data);
  };

  const handleOk = () => {
    onClose(valueState);
  };

  const handleCancel = () => {
    onClose(undefined);
  };

  return (
    <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={isValid}>
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
              name="legalNames"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Legal names"
                  variant="standard"
                  error={!!errors.legalNames}
                  helperText={errors.legalNames ? errors.legalNames?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
    </PropertyChanger>
  );
}
