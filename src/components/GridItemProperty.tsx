import { ReactElement } from 'react';
import { Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';

export interface GridItemPropertyProps {
    propName: string;
    label: string;
    value?: string | ReactElement | ReactElement[];
    handleChange?: (propInfo: GridItemPropertyProps) => void;
}

export function GridItemProperty<T extends GridItemPropertyProps>(propInfo: T) {
    const handleClick = () => {
        if (propInfo.handleChange) {
            propInfo.handleChange(propInfo);
        }
    };

    return (
        <>
            <Grid item xs={12} alignItems="flex-start" container style={{ padding: '0 1rem' }}>
                <Grid item xs={2}>
                    <Typography component="h6" variant="subtitle2">
                        {propInfo.label}
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                    {typeof propInfo.value === 'string' && (
                        <Typography component="p" variant="body1">
                            {propInfo.value}
                        </Typography>
                    )}
                    {typeof propInfo.value !== 'string' && propInfo.value}
                </Grid>
                <Grid item xs="auto">
                    <Tooltip title="Change" arrow placement="left">
                        <IconButton size="small" color="primary" onClick={handleClick}>
                            <Edit sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid item xs={12} container style={{ padding: '1.1rem 0' }}>
                <Grid item xs={2} />
                <Grid item xs={9}>
                    <Divider style={{ width: '100%' }} />
                </Grid>
            </Grid>
        </>
    );
}
