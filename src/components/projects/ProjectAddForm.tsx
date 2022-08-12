import DateSelectForm from '@app/components/DateSelectForm';
import { CountryCodes } from '@app/models';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button, CircularProgress, Grid, IconButton, Slide, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const schema = z
  .object({
    name: z.string(),
    shorthand: z.string(),
    description: z.string(),
    goals: z.string(),
    vision: z.string(),
    startDate: z.date(),
    endDate: z.date().nullable()
    //countryCode: z.nativeEnum(CountryCodes).nullable()
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) {
        return true;
      }
      return data.startDate <= data.endDate;
    },
    { message: 'must be later than start date' }
  );

export type FormInputs = z.infer<typeof schema>;

const ProjectAddForm = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<FormInputs>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      shorthand: '',
      description: '',
      goals: '',
      vision: '',
      startDate: new Date(),
      endDate: null
      //countryCode: null
    }
  });

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const saveData = async () => {
      if (!data.startDate) {
        throw Error('start date is invalid');
      }

      if (!data.endDate) {
        throw Error('end date is invalid');
      }

      // if (!data.countryCode) {
      //   throw Error('country code is invalid');
      // }

      try {
        setSaving(true);
        await ProjectsService.add({
          name: data.name,
          shorthand: data.shorthand,
          startDate: data.startDate,
          endDate: data.endDate,
          description: data.description,
          goals: data.goals,
          vision: data.vision,
          countryCode: CountryCodes.SE // FIXME: country code need to be added to the form
        });
        const action = (key: SnackbarKey) => (
          <Button onClick={() => closeSnackbar(key)}>
            <IconButton color="default" aria-label="close button" component="span" size="small">
              <CloseIcon />
            </IconButton>
          </Button>
        );

        enqueueSnackbar('The project was saved', {
          action,
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          },
          TransitionComponent: Slide
        });

        navigate('..');
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : JSON.stringify(err));
      } finally {
        setSaving(false);
      }
    };
    saveData();
  };

  const onCancel = () => navigate('..');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {!saving && error !== '' && <Alert severity="error">Error in backend adding a project: {error}</Alert>}
      {saving && <CircularProgress />}
      {!saving && error === '' && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project Name"
                    variant="standard"
                    error={!!errors.name}
                    helperText={errors.name ? errors.name?.message : ''}
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="shorthand"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project shorthand"
                    variant="standard"
                    error={!!errors.shorthand}
                    helperText={errors.shorthand ? errors.shorthand?.message : ''}
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
                name="goals"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Goals"
                    variant="standard"
                    multiline
                    rows={4}
                    error={!!errors.goals}
                    helperText={errors.goals ? errors.goals?.message : ''}
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Controller
                name="vision"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Vision"
                    variant="standard"
                    multiline
                    rows={4}
                    error={!!errors.vision}
                    helperText={errors.vision ? errors.vision?.message : ''}
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
          <Stack spacing={2} direction="row" mt={5}>
            <Button type="submit" variant="contained" disabled={!isDirty || !isValid}>
              Submit
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
        </form>
      )}
    </LocalizationProvider>
  );
};

export default ProjectAddForm;
