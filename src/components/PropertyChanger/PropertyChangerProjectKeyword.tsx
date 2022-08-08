import { Grid, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PropertyChanger, PropertyChangerProps } from './PropertyChanger';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProjectKeywordAdd } from '@app/models/projects/ProjectKeyword';

const schema = yup.object().shape({
  name: yup.string().required('name is required'),
  weight: yup
    .number()
    .required('weight is required')
    .test('maxDigitsAfterDecimal', 'number field must have 5 digits after decimal or less', (number) =>
      /^\d(\.\d{1,5})?$/.test(`${number}`)
    )
});

export interface PropertyChangerProjectKeywordProps extends PropertyChangerProps<ProjectKeywordAdd> {}

export function PropertyChangerProjectKeyword({ title, value, open, onClose }: PropertyChangerProjectKeywordProps) {
  const {
    control,
    getValues,
    formState: { isValid, errors }
  } = useForm<ProjectKeywordAdd>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: value
  });

  console.log(title, value, open);

  const handleOk = () => {
    onClose(getValues());
  };

  const handleCancel = () => {
    onClose(undefined);
  };

  return (
    <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={isValid}>
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
    </PropertyChanger>
  );
}
