import { ReactElement } from 'react';
import { Chip, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { Box } from '@mui/system';

export interface EntityPropertyProps {
  propName: string;
  label: string;
  value?: string | ReactElement | ReactElement[];
  handleChange?: (propertyName: string) => void;
}

export function EntityProperty({ propName, label, value, handleChange }: EntityPropertyProps) {
  const handleClick = () => {
    if (handleChange) {
      handleChange(propName);
    }
  };

  // value could be undefined, a string or a react component
  const Value = () => {
    if (!value) {
      return <Chip label="Not avaiable" />;
    }

    if (typeof value === 'string') {
      return (
        <Typography component="p" variant="body1">
          {value}
        </Typography>
      );
    }

    return <>{value}</>;
  };

  // // the "change" icon is only displayed if the prop handleChange is defined */
  return (
    <>
      <Grid item xs={12} container style={{ marginRight: '1.5rem', padding: '0 1rem' }}>
        <Grid item xs={2}>
          <Typography component="h6" variant="subtitle2">
            {label}
          </Typography>
        </Grid>
        <Grid item xs={10} container flexWrap="nowrap" justifyContent="space-between" alignItems="flex-start">
          <Value />
          {handleChange && (
            <Tooltip title="Change" arrow placement="left">
              <IconButton size="small" color="primary" onClick={handleClick}>
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} container style={{ padding: '1.1rem 0' }}>
        <Grid item xs={2} />
        <Grid item xs={10}>
          <Divider style={{ width: '96%' }} />
        </Grid>
      </Grid>
    </>
  );
}
