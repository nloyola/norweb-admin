import { TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { PropertyChangerTextProps } from './PropertyChanger';
import { PropertyChangerDialog } from './PropertyChangerDialog';

export function PropertyChangerText({
  propertyName,
  title,
  label,
  value,
  open,
  onClose,
  multiline
}: PropertyChangerTextProps) {
  const [input, setInput] = useState(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value;
    setInput(newValue);
  };

  const handleOk = () => {
    onClose(propertyName, input);
  };

  const handleCancel = () => {
    onClose(propertyName, undefined);
  };

  return (
    <PropertyChangerDialog title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid={!!input}>
      <TextField
        label={label}
        value={input || ''}
        fullWidth
        variant="standard"
        onChange={handleChange}
        multiline={multiline}
        rows={multiline ? 10 : undefined}
      />
    </PropertyChangerDialog>
  );
}
