import { createElement } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ListAlt, PersonOutline } from '@mui/icons-material';
import { DashboardItem } from './DashboardItem';
import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { NavLink } from 'react-router-dom';

export const dashboardNavItems: DashboardItem[] = [
  { icon: DashboardIcon, label: 'Dashboard', href: '/' },
  { icon: PersonOutline, label: 'People', href: '/people' },
  { icon: ListAlt, label: 'Projects', href: '/projects' }
];

export const dashboardLinkItems = (
  <>
    {dashboardNavItems.map((item, index) => (
      <ListItemButton component={NavLink} to={item.href} key={index}>
        <Tooltip title={item.label} arrow placement="right">
          <ListItemIcon> {createElement(item.icon)}</ListItemIcon>
        </Tooltip>
        <ListItemText primary={item.label} />
      </ListItemButton>
    ))}
  </>
);
