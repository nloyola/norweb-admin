import { ReactElement } from 'react';
import { Chip, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';

export interface GridItemPropertyProps {
  propName: string;
  label: string;
  value?: string | ReactElement | ReactElement[];
  handleChange?: (propertyName: string) => void;
}

export function EntityProperty({ propName, label, value, handleChange }: GridItemPropertyProps) {
  const handleClick = () => {
    if (handleChange) {
      handleChange(propName);
    }
  };

  // the "change" icon is only displayed if the handleChange is defined */
  return (
    <>
      <Grid item xs={12} alignItems="flex-start" container style={{ padding: '0 1rem' }}>
        <Grid item xs={2}>
          <Typography component="h6" variant="subtitle2">
            {label}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {!value && <Chip label="Not avaiable" />}
          {typeof value === 'string' && (
            <Typography component="p" variant="body1">
              {value}
            </Typography>
          )}
          {typeof value !== 'string' && value}
        </Grid>
        {handleChange && (
          <Grid item xs="auto">
            <Tooltip title="Change" arrow placement="left">
              <IconButton size="small" color="primary" onClick={handleClick}>
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
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
