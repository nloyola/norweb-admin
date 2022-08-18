import { DateSelectForm } from '@app/components/DateSelectForm';
import { ProjectFunder, ProjectFunderAdd } from '@app/models/projects/ProjectFunder';
import { FundersApi } from '@app/api/FundersApi';
import { ProjectsApi } from '@app/api/ProjectsApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Button, CircularProgress, Grid, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { ShowError } from '../ShowError';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';

const schema = z
  .object({
    title: z.string(),
    grantId: z.string().nullable(),
    grantType: z.string().nullable(),
    amount: z.string().nullable(),
    startDate: z.date(),
    endDate: z.date().nullable(),
    usage: z.string().nullable(),
    comment: z.string().nullable(),
    funderId: z.number().nullable()
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

export type ProjectFunderFormInputs = z.infer<typeof schema>;

export function ProjectFunderAddForm() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = Number(params.projectId);

  const { enqueueSnackbar } = useSnackbar();

  const {
    error,
    isError,
    isLoading,
    data: funderNames
  } = useQuery(['funders', 'names'], () => FundersApi.listNames(), {
    keepPreviousData: true
  });

  const queryClient = useQueryClient();
  const addProjectFunder = useMutation(
    (projectFunder: ProjectFunderAdd) => ProjectsApi.addFunder(projectId, projectFunder),
    {
      onSuccess: (newProjectFunder: ProjectFunder) => {
        queryClient.setQueryData(['projects', projectId, 'funders'], newProjectFunder);
        queryClient.invalidateQueries(['project', projectId, 'funders']);
        enqueueEntitySavedSnackbar(enqueueSnackbar, 'The Funder for this project was saved');
        navigate('..');
      }
    }
  );

  const initialDate = new Date();
  initialDate.setHours(0, 0, 0, 0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty, isValid, errors }
  } = useForm<ProjectFunderFormInputs>({
    mode: 'all',
    resolver: zodResolver(schema),
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      grantId: '',
      grantType: '',
      amount: '',
      startDate: initialDate,
      endDate: null,
      usage: '',
      comment: '',
      funderId: null
    }
  });

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

  const onSubmit = (data: ProjectFunderFormInputs) => {
    if (!data.funderId) {
      throw Error('funder ID is null');
    }

    if (!data.startDate) {
      throw Error('start date is null');
    }

    if (!data.endDate) {
      throw Error('end date is null');
    }

    const newProjectFunder: ProjectFunderAdd = {
      ...data,
      projectId,
      funderId: data.funderId,
      startDate: data.startDate
    };
    addProjectFunder.mutate(newProjectFunder);
  };

  const handleCancel = () => {
    navigate('../');
  };

  if (isError) {
    return <ShowError error={error} />;
  }

  if (isLoading || !funderNames) {
    return <CircularProgress />;
  }

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
              name="funderId"
              control={control}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  onChange={(_, data) => onChange(data?.id)}
                  options={funderNames.map((fn) => ({
                    id: fn.id,
                    label: `${fn.name} (${fn.acronym})`
                  }))}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Funder"
                      variant="standard"
                      error={!!errors.funderId}
                      helperText={errors.funderId ? errors.funderId?.message : ''}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Controller
              name="grantId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Grant ID"
                  variant="standard"
                  rows={6}
                  error={!!errors.grantId}
                  helperText={errors.grantId ? errors.grantId?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Controller
              name="grantType"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Grant type"
                  variant="standard"
                  error={!!errors.grantType}
                  helperText={errors.grantType ? errors.grantType?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Amount"
                  variant="standard"
                  error={!!errors.amount}
                  helperText={errors.amount ? errors.amount?.message : ''}
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
              name="usage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Usage"
                  variant="standard"
                  error={!!errors.usage}
                  helperText={errors.usage ? errors.usage?.message : ''}
                  fullWidth
                  margin="dense"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Comment"
                  variant="standard"
                  multiline
                  rows={3}
                  error={!!errors.comment}
                  helperText={errors.comment ? errors.comment?.message : ''}
                  fullWidth
                  margin="dense"
                />
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
