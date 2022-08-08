import { TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { PropertyChanger, PropertyChangerProps } from './PropertyChanger';

export interface PropertyChangerTextProps extends PropertyChangerProps<string> {
  multiline: boolean;
}

export const PropertyChangerText = ({
  title,
  id,
  label,
  value,
  open,
  onClose,
  multiline
}: PropertyChangerTextProps) => {
  const [input, setInput] = useState(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value;
    setInput(newValue);
  };

  const handleOk = () => {
    onClose(input);
  };

  const handleCancel = () => {
    onClose(undefined);
  };

  return (
    <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={!!input}>
      <TextField
        id={id}
        label={label}
        value={input}
        fullWidth
        variant="standard"
        onChange={handleChange}
        multiline={multiline}
        rows={multiline ? 10 : undefined}
      />
    </PropertyChanger>
  );
};
