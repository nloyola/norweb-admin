import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { PropertyChanger, PropertyChangerProps } from './PropertyChanger';

export interface PropertyChangerDateProps extends PropertyChangerProps<Date> {
  minDate?: Date;
  maxDate?: Date;
}

export const PropertyChangerDate = ({
  title,
  label,
  value,
  minDate,
  maxDate,
  open,
  onClose
}: PropertyChangerDateProps) => {
  const [input, setInput] = useState(value);

  const handleOk = () => {
    onClose(input ? new Date(input) : undefined);
  };

  const handleCancel = () => {
    onClose(undefined);
  };

  return (
    <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={!!input}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={label}
          value={input}
          minDate={minDate}
          maxDate={maxDate}
          inputFormat="yyyy-MM-dd"
          mask={'____-__-__'}
          onChange={(newValue) => {
            setInput(newValue || undefined);
          }}
          renderInput={(params) => (
            <TextField {...params} inputProps={{ ...params.inputProps, type: 'text' }} variant="standard" fullWidth />
          )}
        />
      </LocalizationProvider>
    </PropertyChanger>
  );
};
