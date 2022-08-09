import { Project } from '@app/models/projects';
import { stringAvatar } from '@app/utils/utils';
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
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';

type ProjectsTableProps = {
  projects: Project[];
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="projects" sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
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
                <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{project.endDate ? new Date(project.endDate).toLocaleDateString() : ''}</TableCell>
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
}
