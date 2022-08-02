import { TextField } from '@mui/material';
import React from 'react';
import PropertyChanger, { PropertyChangerProps } from './PropertyChanger';

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
    const [valueState, setValueState] = React.useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = (event.target as HTMLInputElement).value;
        setValueState(newValue);
    };

    const handleOk = () => {
        onClose(valueState);
    };

    const handleCancel = () => {
        onClose(undefined);
    };

    return (
        <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel}>
            <TextField
                id={id}
                label={label}
                value={valueState}
                fullWidth
                variant="standard"
                onChange={handleChange}
                multiline={multiline}
                rows={multiline ? 10 : undefined}
            />
        </PropertyChanger>
    );
};
