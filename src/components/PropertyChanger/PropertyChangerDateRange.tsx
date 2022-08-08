import { Grid, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { PropertyChanger, PropertyChangerProps } from './PropertyChanger';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DateSelectForm from '../DateSelectForm';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

const schema = yup.object().shape({
  startDate: yup.date().nullable().typeError('invalid date').required('start date is required'),
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

export interface PropertyChangerDateRangeProps extends PropertyChangerProps<DateRange> {}

export function PropertyChangerDateRange({ title, value, open, onClose }: PropertyChangerDateRangeProps) {
  const {
    control,
    getValues,
    formState: { isValid, errors }
  } = useForm<DateRange>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: value
  });

  const handleOk = () => {
    onClose(getValues());
  };

  const handleCancel = () => {
    onClose(undefined);
  };

  return (
    <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={isValid}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form>
          <Grid item xs={12} md={12}>
            <DateSelectForm control={control} names={['startDate', 'endDate']} errors={errors}></DateSelectForm>
          </Grid>
        </form>
      </LocalizationProvider>
    </PropertyChanger>
  );
}
