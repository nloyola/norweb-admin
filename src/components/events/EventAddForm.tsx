import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Status } from '@app/models';
import { Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { EventType, eventTypeToLabel } from '@app/models/events';
import DateSelectForm from '@app/components/DateSelectForm';

export type EventFormInputs = {
  title: string;
  description: string;
  venue: string;
  organizer: string;
  url: string;
  startDate: Date | null;
  endDate: Date | null;
  type: EventType | string;
  status: Status;
};

const schema = yup.object().shape({
  title: yup.string().required('Event name is required'),
  description: yup.string(),
  venue: yup.string(),
  organizer: yup.string(),
  url: yup.string().url(),
  startDate: yup.date().nullable().typeError('invalid date').required('start date is required'),
  endDate: yup
    .date()
    .nullable()
    .typeError('invalid date')
    .test('oneOfRequired', 'must be later than start date', function (endDate) {
      if (!endDate) {
        return true;
      }
      return this.parent.startDate <= endDate;
    }),
  type: yup.mixed<EventType>().oneOf(Object.values(EventType)).required()
});

type EventAddFormProps = {
  onSubmit: (values: EventFormInputs) => void;
  onCancel: () => void;
};

export function EventAddForm({ onSubmit, onCancel }: EventAddFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors }
  } = useForm<EventFormInputs>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      venue: '',
      organizer: '',
      url: '',
      startDate: null,
      endDate: null,
      type: ''
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  variant="standard"
                  error={!!errors.title}
                  helperText={errors.title ? errors.title?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  variant="standard"
                  multiline
                  rows={6}
                  error={!!errors.description}
                  helperText={errors.description ? errors.description?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Controller
              name="venue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Venue"
                  variant="standard"
                  error={!!errors.venue}
                  helperText={errors.venue ? errors.venue?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Controller
              name="organizer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Organizer"
                  variant="standard"
                  error={!!errors.organizer}
                  helperText={errors.organizer ? errors.organizer?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputProps={{ type: 'url' }}
                  label="Url"
                  variant="standard"
                  error={!!errors.url}
                  helperText={errors.url ? errors.url?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <DateSelectForm control={control} names={['startDate', 'endDate']} errors={errors}></DateSelectForm>
          </Grid>
        </Grid>
        <Grid item xs={6} md={6}>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <TextField {...field} select label="Event type" variant="standard" fullWidth margin="dense">
                {Object.values(EventType).map((value) => (
                  <MenuItem key={value} value={value}>
                    {eventTypeToLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Stack spacing={2} direction="row" mt={5}>
          <Button type="submit" variant="contained" disabled={!isDirty || !isValid}>
            Submit
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </form>
    </LocalizationProvider>
  );
}
