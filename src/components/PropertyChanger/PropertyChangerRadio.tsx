import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { PropertyChanger, PropertyChangerProps, PropertyOption } from './PropertyChanger';

export const PropertyChangerRadio = <T extends unknown>({
  title,
  label,
  value,
  open,
  onClose,
  options
}: PropertyChangerProps<T>) => {
  const option = options?.find((option) => option.id === value);
  const [valueState, setValueState] = useState<PropertyOption<T> | undefined>(option);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = (event.target as HTMLInputElement).value;
    const opt = options?.find((option) => option.id === newValue);
    if (opt) {
      setValueState(opt);
    }
  };

  const handleOk = () => {
    onClose(valueState?.id);
  };

  const handleCancel = () => {
    onClose(undefined);
  };

  return (
    <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel} valid>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue={value}
          name="radio-buttons-group"
          onChange={handleChange}
        >
          {(options || []).map((option) => (
            <FormControlLabel key={option.label} value={option.id} control={<Radio />} label={option.label} />
          ))}
        </RadioGroup>
      </FormControl>
    </PropertyChanger>
  );
};
