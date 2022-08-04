import { Stack, Typography } from '@mui/material';

export function nlToFragments(str: string) {
  if (!str || str === '') {
    return <>Not Available</>;
  }

  const fragments = str.split('\n').map((item, key) => {
    if (item === '') {
      return null;
    }

    return <Typography key={key}>{item}</Typography>;
  });

  return <Stack spacing={2}>{fragments}</Stack>;
}
