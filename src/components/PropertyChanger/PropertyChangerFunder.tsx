import { FundersApi } from '@app/api/FundersApi';
import { Funder, FunderName } from '@app/models/funders';
import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, CircularProgress, Grid, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { z } from 'zod';
import { PropertyChangerProps } from './PropertyChanger';
import { PropertyChangerDialog } from './PropertyChangerDialog';

const schema = z.object({
  funderId: z.number()
});

type FormInputs = z.infer<typeof schema>;

export function PropertyChangerFunder({ propertyName, title, value, open, onClose }: PropertyChangerProps<number>) {
  const {
    control,
    getValues,
    formState: { isValid, errors }
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      funderId: value
    }
  });

  const fundersQuery = useQuery(['funders', 'names'], async () => FundersApi.listNames(), { keepPreviousData: true });

  const handleOk = () => {
    onClose(propertyName, getValues().funderId);
  };

  const handleCancel = () => {
    onClose(propertyName, undefined);
  };

  if (fundersQuery.isLoading || !fundersQuery.data) {
    return <CircularProgress />;
  }

  const funderToLabel = (funder: FunderName) => `${funder?.name} (${funder?.acronym})`;

  const defaultFunder = fundersQuery.data.find((fn) => fn.id === value);
  const defaultFunderOption = { id: defaultFunder?.id, label: defaultFunder ? funderToLabel(defaultFunder) : null };

  return (
    <PropertyChangerDialog title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={isValid}>
      <form>
        <Grid item xs={12} md={12}>
          <Controller
            name="funderId"
            control={control}
            render={({ field: { onChange } }) => (
              <Autocomplete
                defaultValue={defaultFunderOption}
                onChange={(_, data) => onChange(data?.id)}
                options={(fundersQuery.data || []).map((fn) => ({ id: fn.id, label: funderToLabel(fn) }))}
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
      </form>
    </PropertyChangerDialog>
  );
}
