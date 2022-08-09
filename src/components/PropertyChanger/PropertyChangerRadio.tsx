import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { PropertyChangerProps, PropertyOption } from './PropertyChanger';
import { PropertyChangerDialog } from './PropertyChangerDialog';

export function PropertyChangerRadio({
  propertyName,
  title,
  label,
  value,
  open,
  onClose,
  propertyOptions
}: PropertyChangerProps<unknown>) {
  const selectedOption = propertyOptions?.find((option) => option.id === value);
  const [input, setInput] = useState<PropertyOption<unknown> | undefined>(selectedOption);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value;
    const opt = propertyOptions?.find((option) => option.id === newValue);
    if (opt) {
      setInput(opt);
    }
  };

  const handleOk = () => {
    onClose(propertyName, input?.id);
  };

  const handleCancel = () => {
    onClose(propertyName, undefined);
  };

  return (
    <PropertyChangerDialog title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue={value}
          name="radio-buttons-group"
          onChange={handleChange}
        >
          {(propertyOptions || []).map((option) => (
            <FormControlLabel key={option.label} value={option.id} control={<Radio />} label={option.label} />
          ))}
        </RadioGroup>
      </FormControl>
    </PropertyChangerDialog>
  );
}
