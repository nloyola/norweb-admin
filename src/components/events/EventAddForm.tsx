import { ProjectEventsApi } from '@app/api/ProjectEventsApi';
import { DateSelectForm } from '@app/components/DateSelectForm';
import { Event, EventAdd, EventType, eventTypeToLabel } from '@app/models/events';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';

const schema = z
  .object({
    title: z.string().min(1, { message: 'a title is required' }),
    description: z.string().nullable(),
    venue: z.string().nullable(),
    organizer: z.string().nullable(),
    url: z.string().url({ message: 'not a valid URL' }).nullable(),
    startDate: z.date(),
    endDate: z.date().nullable(),
    type: z.nativeEnum(EventType)
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

export function EventAddForm() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = Number(params.projectId);

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const addEvent = useMutation((event: EventAdd) => ProjectEventsApi.add(projectId, event), {
    onSuccess: (newEvent: Event) => {
      queryClient.setQueryData(['projects', projectId, 'events'], newEvent);
      queryClient.invalidateQueries(['events']);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The event was saved');
      navigate('..');
    }
  });

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
      type: undefined
    }
  });

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

  const onSubmit = (data: EventFormInputs) => {
    if (!data.startDate) {
      throw Error('start date is null');
    }

    if (!data.endDate) {
      throw Error('end date is null');
    }

    if (!data.type) {
      throw Error('event type is null');
    }

    const newEvent: EventAdd = { ...data, startDate: data.startDate, type: data.type };
    addEvent.mutate(newEvent);
  };

  const handleCancel = () => {
    navigate('../');
  };

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
                  inputProps={{ type: 'url', id: 'website' }}
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
          <Grid item xs={12} md={12}>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Event type"
                  variant="standard"
                  fullWidth
                  margin="dense"
                  error={!!errors.type}
                  helperText={errors.type ? errors.type?.message : ''}
                  inputProps={{ value: field.value || '' }}
                >
                  {Object.values(EventType).map((value) => (
                    <MenuItem key={value} value={value}>
                      {eventTypeToLabel(value)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>
        <Stack spacing={2} direction="row" mt={5}>
          <Button type="submit" variant="contained" disabled={!isDirty || !isValid}>
            Submit
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </form>
    </LocalizationProvider>
  );
}
