import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import PropertyChanger, { PropertyChangerProps, PropertyOption } from './PropertyChanger';

export const PropertyChangerRadio = <T extends unknown>({
    title,
    label,
    value,
    open,
    onClose,
    options
}: PropertyChangerProps<T>) => {
    const [valueState, setValueState] = React.useState<PropertyOption<T> | null>(
        options.find((option) => option.id === value)
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = (event.target as HTMLInputElement).value;
        setValueState(options.find((option) => option.id === newValue));
    };

    const handleOk = () => {
        onClose(valueState.id);
    };

    const handleCancel = () => {
        onClose(null);
    };

    return (
        <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel}>
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={value}
                    name="radio-buttons-group"
                    onChange={handleChange}
                >
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.label}
                            value={option.id}
                            control={<Radio />}
                            label={option.label}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </PropertyChanger>
    );
};
