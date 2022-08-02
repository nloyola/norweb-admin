import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import PropertyChanger, { PropertyChangerProps, PropertyOption } from './PropertyChanger';

export const PropertyChangerAutocomplete = <T extends unknown>({
    title,
    label,
    value,
    open,
    onClose,
    options
}: PropertyChangerProps<T>) => {
    const option = options?.find((option) => option.id === value);
    const [valueState, setValueState] = React.useState<PropertyOption<T> | undefined>(option);

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
        <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel}>
            <Autocomplete
                options={options || []}
                value={valueState}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} label={label} variant="standard" />}
            />
        </PropertyChanger>
    );
};
