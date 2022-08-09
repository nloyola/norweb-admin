import { Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateSelectForm from '../DateSelectForm';
import { PropertyChangerDialog } from './PropertyChangerDialog';
import { DateRange, PropertyChangerDateRangeProps } from './PropertyChanger';

const schema = yup.object().shape({
  startDate: yup
    .date()
    .nullable()
    .typeError('invalid date')
    .required('start date is required')
    .test('oneOfRequired', 'must be before end date', function (startDate) {
      if (!startDate) {
        return false;
      }
      return startDate <= this.parent.endDate;
    }),
  endDate: yup
    .date()
    .nullable()
    .typeError('invalid date')
    .test('oneOfRequired', 'must be later than start date', function (endDate) {
      if (!endDate) {
        return true;
      }
      return this.parent.startDate <= endDate;
    })
});

export function PropertyChangerDateRange({ propertyName, title, value, open, onClose }: PropertyChangerDateRangeProps) {
  const {
    control,
    getValues,
    watch,
    formState: { isValid, errors }
  } = useForm<DateRange>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: value?.startDate,
      endDate: value?.endDate
    }
  });

  const watchStartDate = watch('startDate', value?.startDate);
  const watchEndDate = watch('endDate', value?.endDate);

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
