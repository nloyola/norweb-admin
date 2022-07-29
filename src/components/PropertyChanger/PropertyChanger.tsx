import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

export interface PropertyOption<T> {
    id: T;
    label: string;
}

export interface PropertyChangerProps<T> {
    title: string;
    id: string;
    label: string;
    value?: T;
    options?: PropertyOption<T>[];
    open: boolean;
    onClose: (value?: T) => void;
}

interface PropertyChangerInternalProps {
    children: React.ReactNode;
    title: string;
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}

const PropertyChanger = ({ title, open, onOk, onCancel, children }: PropertyChangerInternalProps) => {
    const handleOk = () => {
        onOk();
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <Dialog onClose={handleCancel} open={open} fullWidth={true} maxWidth="md">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PropertyChanger;
