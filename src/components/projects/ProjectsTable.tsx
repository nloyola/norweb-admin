import { Project } from '@app/models/projects';
import { dateToString, stringAvatar } from '@app/utils/utils';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Avatar,
  Box,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Status, statusToLabel } from '@app/models';

export const ProjectsTable: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="projects" sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => {
            return (
              <TableRow key={project.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      gap: 1
                    }}
                  >
                    <Avatar {...stringAvatar(project.name, 10, 24, 24)}></Avatar>
                    {project.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={project.status === Status.ACTIVE ? 'primary' : 'default'}
                    label={statusToLabel(project.status)}
                  />
                </TableCell>
                <TableCell>{dateToString(project.startDate)}</TableCell>
                <TableCell>{dateToString(project.endDate)}</TableCell>
                <TableCell align="right">
                  <Link to={`/projects/${project.id}`}>
                    <Button size="small" variant="outlined">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
