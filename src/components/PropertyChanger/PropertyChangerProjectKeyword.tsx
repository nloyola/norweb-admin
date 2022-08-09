import { Grid, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { PropertyChangerDialog } from './PropertyChangerDialog';
import { PropertyChangerProjectKeywordProps } from './PropertyChanger';

const schema = yup.object().shape({
  name: yup.string().required('name is required'),
  weight: yup
    .number()
    .required('weight is required')
    .test('maxDigitsAfterDecimal', 'number field must have 5 digits after decimal or less', (number) =>
      /^\d(\.\d{1,5})?$/.test(`${number}`)
    )
});

export function PropertyChangerProjectKeyword({
  propertyName,
  title,
  value,
  open,
  onClose
}: PropertyChangerProjectKeywordProps) {
  const {
    control,
    getValues,
    formState: { isValid, errors }
  } = useForm<ProjectKeywordUpdate>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: value
  });

  const handleOk = () => {
    onClose(propertyName, getValues());
  };

  const handleCancel = () => {
    onClose(propertyName, undefined);
  };

  return (
    <PropertyChangerDialog title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={isValid}>
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
    </PropertyChangerDialog>
  );
}
