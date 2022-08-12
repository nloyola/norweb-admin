import DateSelectForm from '@app/components/DateSelectForm';
import { EventType, eventTypeToLabel } from '@app/models/events';
import { Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z
  .object({
    title: z.string().min(1, { message: 'a title is required' }),
    description: z.string(),
    venue: z.string(),
    organizer: z.string(),
    url: z.string().url({ message: 'not a valid URL' }),
    startDate: z.date(),
    endDate: z.date().nullable(),
    type: z.union([z.string().min(1), z.nativeEnum(EventType)])
  })
  .superRefine((data, ctx) => {
    if (!data.startDate || !data.endDate) {
      return true;
    }

    if (data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: 'must be before the end date'
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'must be fater the start date'
      });
    }
  });

export type EventFormInputs = z.infer<typeof schema>;

type EventAddFormProps = {
  onSubmit: (values: EventFormInputs) => void;
  onCancel: () => void;
};

export function EventAddForm({ onSubmit, onCancel }: EventAddFormProps) {
  const initialDate = new Date();
  initialDate.setHours(0, 0, 0, 0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<EventFormInputs>({
    mode: 'all',
    resolver: zodResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      venue: '',
      organizer: '',
      url: '',
      startDate: initialDate,
      endDate: null,
      type: ''
    }
  });

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

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
            <DateSelectForm
              control={control}
              names={['startDate', 'endDate']}
              errors={errors}
              minDate={watchStartDate}
              maxDate={watchEndDate}
            ></DateSelectForm>
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
