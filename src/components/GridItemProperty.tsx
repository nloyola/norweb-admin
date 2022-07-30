import { ReactElement } from 'react';
import { Box, createTheme, Grid, IconButton, ThemeProvider, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Edit } from '@mui/icons-material';

export interface GridItemPropertyProps {
    propName: string;
    label: string;
    value?: string | ReactElement | ReactElement[];
    handleChange?: (propInfo: GridItemPropertyProps) => void;
}

const theme = createTheme({
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: grey[200]
                }
            }
        },
        MuiTypography: {
            variants: [
                {
                    props: {
                        variant: 'subtitle2'
                    },
                    style: {
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        color: grey[500]
                    }
                },
                {
                    props: {
                        variant: 'body1'
                    },
                    style: {
                        fontSize: '1rem',
                        color: 'black'
                    }
                }
            ]
        }
    }
});

export function GridItemProperty<T extends GridItemPropertyProps>(propInfo: T) {
    const handleClick = () => {
        if (propInfo.handleChange) {
            propInfo.handleChange(propInfo);
        }
    };

    return (
        <ThemeProvider theme={theme}>
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
            <Grid item xs={1}>
                <Tooltip title="Change" arrow placement="left">
                    <IconButton size="small" color="primary" onClick={handleClick}>
                        <Edit sx={{ fontSize: 14 }} />
                    </IconButton>
                </Tooltip>
            </Grid>
        </ThemeProvider>
    );
}
