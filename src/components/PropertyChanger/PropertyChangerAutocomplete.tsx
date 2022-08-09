import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { PropertyChangerProps, PropertyOption } from './PropertyChanger';
import { PropertyChangerDialog } from './PropertyChangerDialog';

export const PropertyChangerAutocomplete = <T extends unknown>({
  propertyName,
  title,
  label,
  value,
  open,
  onClose,
  propertyOptions: options
}: PropertyChangerProps<T>) => {
  if (!options) {
    throw new Error('invalid options');
  }

  const option = options?.find((option) => option.id === value) || null;
  const [input, setInput] = useState<PropertyOption<T> | null>(option);

  const handleChange = (_event: any, newValue: any) => {
    setInput(newValue);
  };

  const handleOk = () => {
    onClose(propertyName, input?.id);
  };

  const handleCancel = () => {
    onClose(propertyName, undefined);
  };

  return (
    <PropertyChangerDialog title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={!!input}>
      <Autocomplete
        options={options}
        value={input}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} label={label} variant="standard" />}
      />
    </PropertyChangerDialog>
  );
};
