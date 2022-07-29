import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Event, ListAlt, PersonOutline } from '@mui/icons-material';
import { DashboardItem } from './DashboardItem';
import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';

export const dashboardNavItems: DashboardItem[] = [
    { icon: DashboardIcon, label: 'Dashboard', href: '/' },
    { icon: PersonOutline, label: 'People', href: '/people' },
    { icon: ListAlt, label: 'Projects', href: '/projects' },
    { icon: Event, label: 'Events', href: '/events' }
];

export const dashboardLinkItems = (
    <>
        {dashboardNavItems.map((item, index) => (
            <ListItemButton key={index}>
                <Tooltip title={item.label} arrow placement="right">
                    <ListItemIcon> {React.createElement(item.icon)}</ListItemIcon>
                </Tooltip>
                <ListItemText primary={item.label} />
            </ListItemButton>
        ))}
    </>
);
