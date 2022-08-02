import { Grid, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller } from 'react-hook-form';

type DateSelectFormProps = {
    names: string[];
    control: any; // FIXME declare with correct type
    errors: any; // FIXME declare with correct type
};

export function DateSelectForm({ names, control, errors }: DateSelectFormProps) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={6} md={6}>
                <Controller
                    control={control}
                    name={names[0]}
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            label="Start date"
                            inputFormat="yyyy-MM-dd"
                            mask={'____-__-__'}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    inputProps={{ ...params.inputProps, type: 'text' }}
                                    variant="standard"
                                    error={!!errors[names[0]]}
                                    helperText={errors[names[0]] ? errors[names[0]]?.message : ''}
                                    fullWidth
                                />
                            )}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={6} md={6}>
                <Controller
                    name={names[1]}
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            label="End date"
                            inputFormat="yyyy-MM-dd"
                            mask={'____-__-__'}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    inputProps={{ ...params.inputProps, type: 'text' }}
                                    variant="standard"
                                    error={!!errors[names[1]]}
                                    helperText={errors[names[1]] ? errors[names[1]]?.message : ''}
                                    fullWidth
                                />
                            )}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
}
export default DateSelectForm;
