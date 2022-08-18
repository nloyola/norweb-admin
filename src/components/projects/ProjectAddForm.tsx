import { DateSelectForm } from '@app/components/DateSelectForm';
import { CountryCodes, CountryNames } from '@app/models';
import { Project, ProjectAdd } from '@app/models/projects';
import { ProjectsApi } from '@app/api/ProjectsApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Button, Grid, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSnackbar } from 'notistack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ShowError } from '../ShowError';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';

const schema = z
  .object({
    name: z.string(),
    shorthand: z.string(),
    description: z.string(),
    goals: z.string(),
    vision: z.string(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    countryCode: z.nativeEnum(CountryCodes).nullable()
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

export const ProjectAddForm = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
      startDate: null,
      endDate: null,
      countryCode: null
    }
  });

  const queryClient = useQueryClient();
  const addProject = useMutation((project: ProjectAdd) => ProjectsApi.add(project), {
    onSuccess: (newProject: Project) => {
      queryClient.setQueryData(['projects', newProject.id], newProject);
      queryClient.invalidateQueries(['projects']);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The project was saved');
      navigate('..');
    }
  });

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    if (!data.startDate) {
      throw Error('start date is invalid');
    }

    if (!data.startDate) {
      throw Error('start date is invalid');
    }

    if (!data.endDate) {
      throw Error('end date is invalid');
    }

    if (!data.countryCode) {
      throw Error('country code is invalid');
    }

    addProject.mutate({
      ...data,
      startDate: data.startDate
    });
  };

  // console.log({ isValid, errors });

  const onCancel = () => navigate('..');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {addProject.isError && <ShowError error={addProject.error} />}
      {!addProject.isError && (
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
              <Controller
                name="countryCode"
                control={control}
                render={({ field: { onChange } }) => (
                  <Autocomplete
                    onChange={(_, data) => onChange(data?.id)}
                    options={Object.entries(CountryNames).map(([id, label]) => ({ id, label: `${label} (${id})` }))}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        variant="standard"
                        error={!!errors.countryCode}
                        helperText={errors.countryCode ? errors.countryCode?.message : ''}
                      />
                    )}
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
