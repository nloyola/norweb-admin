import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';
import { PropertyChanger, PropertyChangerProps, PropertyOption } from './PropertyChanger';

export const PropertyChangerAutocomplete = <T extends unknown>({
  title,
  label,
  value,
  open,
  onClose,
  options
}: PropertyChangerProps<T>) => {
  if (!options) {
    throw new Error('invalid options');
  }

  const option = options?.find((option) => option.id === value) || null;
  const [valueState, setValueState] = useState<PropertyOption<T> | null>(option);

  const handleChange = (_event: any, newValue: any) => {
    setValueState(newValue);
  };

  const handleOk = () => {
    onClose(valueState?.id);
  };

  const handleCancel = () => {
    onClose(undefined);
  };

  return (
    <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={!!valueState}>
      <Autocomplete
        options={options}
        value={valueState}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} label={label} variant="standard" />}
      />
    </PropertyChanger>
  );
};
