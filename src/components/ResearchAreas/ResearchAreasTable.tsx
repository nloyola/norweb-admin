import { ResearchArea } from '@app/models/projects/ResearchArea';
import { Status, statusToLabel } from '@app/models/Status';
import { Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export const ResearchAreasTable: React.FC<{
  researchAreas: ResearchArea[];
  onSelected: (area: ResearchArea) => void;
}> = ({ researchAreas, onSelected }) => (
  <TableContainer component={Paper}>
    <Table size="small" aria-label="researchAreas" sx={{ minWidth: 300 }}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {researchAreas.map((area) => {
          return (
            <TableRow key={area.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{area.name}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={area.status === Status.ACTIVE ? 'primary' : 'default'}
                  label={statusToLabel(area.status)}
                />
              </TableCell>
              <TableCell align="right">
                <Button size="small" variant="outlined" onClick={() => onSelected(area)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);
