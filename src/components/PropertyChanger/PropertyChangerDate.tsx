import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { PropertyChangerDateProps } from './PropertyChanger';
import { PropertyChangerDialog } from './PropertyChangerDialog';

export const PropertyChangerDate = ({
  propertyName,
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
    onClose(propertyName, input ? new Date(input) : undefined);
  };

  const handleCancel = () => {
    onClose(propertyName, undefined);
  };

  return (
    <PropertyChangerDialog title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={!!input}>
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
    </PropertyChangerDialog>
  );
};
