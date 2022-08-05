import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
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

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const navigate = useNavigate();

  return (
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
  );
}
