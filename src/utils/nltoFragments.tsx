import { Stack, Typography } from '@mui/material';
import { Fragment } from 'react';

export function nlToFragments(str: string): React.ReactElement {
    if (!str || str === '') {
        return <Fragment>Not Available</Fragment>;
    }

    const fragments = str.split('\n').map((item, key) => {
        if (item === '') {
            return null;
        }

        return <Typography key={key}>{item}</Typography>;
    });

    return <Stack spacing={2}>{fragments}</Stack>;
}
