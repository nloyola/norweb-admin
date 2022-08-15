import { Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm } from 'react-hook-form';
import { DateSelectForm } from '../DateSelectForm';
import { PropertyChangerDialog } from './PropertyChangerDialog';
import { DateRange, PropertyChangerDateRangeProps } from './PropertyChanger';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z
  .object({
    startDate: z.date(),
    endDate: z.date().nullable()
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

export function PropertyChangerDateRange({ propertyName, title, value, open, onClose }: PropertyChangerDateRangeProps) {
  const {
    control,
    getValues,
    watch,
    formState: { isValid, errors }
  } = useForm<DateRange>({
    resolver: zodResolver(schema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      startDate: value?.startDate,
      endDate: value?.endDate
    }
  });

  const watchStartDate = watch('startDate', value?.startDate);
  const watchEndDate = watch('endDate', value?.endDate);

  console.log(watchStartDate, watchEndDate);

  const handleOk = () => {
    onClose(propertyName, getValues());
  };

  const handleCancel = () => {
    onClose(propertyName, undefined);
  };

  return (
    <PropertyChangerDialog title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={isValid}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form>
          <Grid item xs={12} md={12}>
            <DateSelectForm
              control={control}
              names={['startDate', 'endDate']}
              errors={errors}
              minDate={watchStartDate}
              maxDate={watchEndDate}
            ></DateSelectForm>
          </Grid>
        </form>
      </LocalizationProvider>
    </PropertyChangerDialog>
  );
}
