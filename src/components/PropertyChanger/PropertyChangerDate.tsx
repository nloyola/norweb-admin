import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React from 'react';
import PropertyChanger, { PropertyChangerProps } from './PropertyChanger';

export interface PropertyChangerDateProps extends PropertyChangerProps<Date> {
    minDate?: Date;
    maxDate?: Date;
}

export const PropertyChangerDate = ({
    title,
    label,
    value,
    minDate,
    maxDate,
    open,
    onClose
}: PropertyChangerDateProps) => {
    const [valueState, setValueState] = React.useState(value);

    const handleOk = () => {
        onClose(new Date(valueState));
    };

    const handleCancel = () => {
        onClose(null);
    };

    return (
        <PropertyChanger title={title} open={open} onOk={handleOk} onCancel={handleCancel}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label={label}
                    value={valueState}
                    minDate={minDate}
                    maxDate={maxDate}
                    inputFormat="yyyy-MM-dd"
                    mask={'____-__-__'}
                    onChange={(newValue) => {
                        setValueState(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            inputProps={{ ...params.inputProps, type: 'text' }}
                            variant="standard"
                            fullWidth
                        />
                    )}
                />
            </LocalizationProvider>
        </PropertyChanger>
    );
};
