import { ProjectFunder } from '@app/models/projects/ProjectFunder';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

export const ProjectFundersTable: React.FC<{ projectFunders: ProjectFunder[] }> = ({ projectFunders }) => {
  const params = useParams();

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="funders" sx={{ minWidth: 300 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Funder</TableCell>
            <TableCell>Grant type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projectFunders.map((projectFunder) => {
            return (
              <TableRow key={projectFunder.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{projectFunder.title}</TableCell>
                <TableCell>
                  {projectFunder.funder.name} ({projectFunder.funder.acronym})
                </TableCell>
                <TableCell>{projectFunder.grantType}</TableCell>
                <TableCell>{projectFunder.amount}</TableCell>
                <TableCell align="right">
                  <Link to={`/project/${params.projectId}/funders/${projectFunder.id}`}>
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
