import { CountryCodes, CountryNames } from '@app/models';
import { FunderTypes, funderTypeToLabel } from '@app/models/funders';
import { FundersService } from '@app/services/funders/FundersService';
import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Slide,
  Stack,
  TextField
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ShowError } from '../ShowError';

const schema = z.object({
  name: z.string(),
  acronym: z.string(),
  web: z.string().url(),
  type: z.union([z.string().min(1), z.nativeEnum(FunderTypes)]),

  // use the following when country code is required
  // countryCode: z.union([z.string().min(1), z.nativeEnum(CountryCodes)])
  countryCode: z.nativeEnum(CountryCodes).nullable()
});

export type FormInputs = z.infer<typeof schema>;

export const FunderAddForm = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
      type: '',
      countryCode: null
    }
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const saveData = async () => {
      if (!data.countryCode) {
        throw Error('country code is invalid');
      }

      try {
        setSaving(true);
        await FundersService.add({
          name: data.name,
          acronym: data.acronym,
          countryCode: data.countryCode as CountryCodes,
          web: data.web,
          type: data.type as FunderTypes
        });

        const action = (key: SnackbarKey) => (
          <Button onClick={() => closeSnackbar(key)}>
            <IconButton color="default" aria-label="close button" component="span" size="small">
              <CloseIcon />
            </IconButton>
          </Button>
        );

        enqueueSnackbar('The funder was saved', {
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
      {!saving && error !== '' && <ShowError error={`Error in backend adding a funder: ${error}}`} />}
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
