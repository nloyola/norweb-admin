import { Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller } from 'react-hook-form';

type DateSelectFormProps = {
  names: string[];
  control: any; // FIXME declare with correct type
  errors: any; // FIXME declare with correct type
  minDate?: Date | null;
  maxDate?: Date | null;
};

export function DateSelectForm({ names, control, errors, minDate, maxDate }: DateSelectFormProps) {
  return (
    <Grid container spacing={3}>
      <Controller
        control={control}
        name={names[0]}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="Start date"
            maxDate={maxDate}
            inputFormat="yyyy-MM-dd"
            mask={'____-__-__'}
            renderInput={(params) => (
              <Grid item xs={6} md={6}>
                <TextField
                  {...params}
                  inputProps={{ ...params.inputProps, type: 'text' }}
                  variant="standard"
                  error={!!errors[names[0]]}
                  helperText={errors[names[0]] ? errors[names[0]]?.message : ''}
                  fullWidth
                />
              </Grid>
            )}
          />
        )}
      />
      <Controller
        name={names[1]}
        control={control}
        render={({ field }) => (
          <DatePicker
            {...field}
            label="End date"
            minDate={minDate}
            inputFormat="yyyy-MM-dd"
            mask={'____-__-__'}
            renderInput={(params) => (
              <Grid item xs={6} md={6}>
                <TextField
                  {...params}
                  inputProps={{ ...params.inputProps, type: 'text' }}
                  variant="standard"
                  error={!!errors[names[1]]}
                  helperText={errors[names[1]] ? errors[names[1]]?.message : ''}
                  fullWidth
                />
              </Grid>
            )}
          />
        )}
      />
    </Grid>
  );
}
