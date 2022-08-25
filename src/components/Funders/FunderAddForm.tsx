import { CountryCodes, CountryNames } from '@app/models';
import { Funder, FunderAdd, FunderTypes, funderTypeToLabel } from '@app/models/funders';
import { FundersApi } from '@app/api/FundersApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSnackbar } from 'notistack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ShowError } from '../ShowError';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';

const schema = z.object({
  name: z.string(),
  acronym: z.string(),
  web: z.string().url(),
  type: z.nativeEnum(FunderTypes),
  countryCode: z.nativeEnum(CountryCodes)
});

export type FormInputs = z.infer<typeof schema>;

export const FunderAddForm = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors }
  } = useForm<FormInputs>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      acronym: '',
      web: '',
      type: undefined,
      countryCode: undefined
    }
  });

  const queryClient = useQueryClient();
  const addFunder = useMutation((funder: FunderAdd) => FundersApi.add(funder), {
    onSuccess: (newFunder: Funder) => {
      queryClient.setQueryData(['funders', newFunder.id], newFunder);
      queryClient.invalidateQueries(['funders']);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The funder was saved');
      navigate('..');
    }
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    if (!data.countryCode) {
      throw Error('country code is invalid');
    }
    if (!data.type) {
      throw Error('funder type code is invalid');
    }

    addFunder.mutate({ ...data, countryCode: data.countryCode, type: data.type });
  };

  const onCancel = () => navigate('..');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {addFunder.isError && <ShowError error={`Error in backend adding a funder: ${addFunder.error}}`} />}
      {!addFunder.isError && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Funder Name"
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
                name="acronym"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Funder acronym"
                    variant="standard"
                    error={!!errors.acronym}
                    helperText={errors.acronym ? errors.acronym?.message : ''}
                    fullWidth
                    margin="dense"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Controller
                name="web"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Website"
                    variant="standard"
                    rows={4}
                    error={!!errors.web}
                    helperText={errors.web ? errors.web?.message : ''}
                    fullWidth
                    margin="dense"
                    inputProps={{ type: 'url', id: 'website' }}
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
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Funder type"
                    variant="standard"
                    fullWidth
                    margin="dense"
                    error={!!errors.type}
                    helperText={errors.type ? errors.type?.message : ''}
                    inputProps={{ value: field.value || '' }}
                  >
                    {Object.values(FunderTypes).map((value) => (
                      <MenuItem key={value} value={value}>
                        {funderTypeToLabel(value)}
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
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
        </form>
      )}
    </LocalizationProvider>
  );
};

export default FunderAddForm;
