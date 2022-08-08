import { Breadcrumbs as MUIBreadcrumbs, Link, Paper, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

export type Breadcrumb = {
  label: string;
  route: string;
  isLast?: boolean;
};

type BreadcrumbsProps = {
  crumbs: Breadcrumb[];
};

// https://stackoverflow.com/questions/71592649/change-breadcrumb-component-that-was-done-with-react-router-v5-to-react-router-v

// https://pavsaund.com/post/2022-02-23-dynamic-breadcrumbs-and-routes-with-react-router/

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 2, mb: 5 }}>
      <MUIBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {/* {pathnames.length ? <Link onClick={() => navigate('/')}>Home</Link> : <Typography> Home </Typography>} */}
        {crumbs.map(({ label, route, isLast }) => {
          if (isLast) {
            return <Typography key={label}>{label}</Typography>;
          }

          return (
            <Link key={label} underline="hover" color="inherit" onClick={() => navigate(route)}>
              {label}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Paper>
  );
}
