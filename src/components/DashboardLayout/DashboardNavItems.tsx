import { ExpandLess, ExpandMore, ListAlt, PeopleOutline, PersonOutline, StarBorder } from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useState } from 'react';
import ScienceIcon from '@mui/icons-material/Science';

export function DashboardLinkItems() {
  const [openProjects, setOpenProjects] = useState(true);

  const handleProjectsClick = () => {
    setOpenProjects(!openProjects);
  };

  return (
    <List component="nav">
      <ListItemButton component={Link} to="/">
        <Tooltip title="Dashboard" arrow placement="right">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton component={Link} to="/people">
        <Tooltip title="People" arrow placement="right">
          <ListItemIcon>
            <PersonOutline />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="People" />
      </ListItemButton>

      <ListItemButton component={Link} to="/projects">
        <Tooltip title="Projects" arrow placement="right">
          <ListItemIcon>
            <ListAlt />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="Projects" />
        {openProjects ? <ExpandLess onClick={handleProjectsClick} /> : <ExpandMore onClick={handleProjectsClick} />}
      </ListItemButton>

      <Collapse in={openProjects} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton component={Link} to="/funders" sx={{ pl: 4 }}>
            <Tooltip title="Funders" arrow placement="right">
              <ListItemIcon>
                <CreditCardIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Funders" />
          </ListItemButton>
          <ListItemButton component={Link} to="/research-areas" sx={{ pl: 4 }}>
            <Tooltip title="Research areas" arrow placement="right">
              <ListItemIcon>
                <ScienceIcon />
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Research areas" />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton component={Link} to="/visitors">
        <Tooltip title="Visitors" arrow placement="right">
          <ListItemIcon>
            <PeopleOutline />
          </ListItemIcon>
        </Tooltip>
        <ListItemText primary="Visitors" />
      </ListItemButton>
    </List>
  );
}
