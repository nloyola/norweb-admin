import { CountryNames, Status, statusToLabel } from '@app/models';
import { Funder, funderTypeToLabel } from '@app/models/funders';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';

export const FundersTable: React.FC<{ funders: Funder[] }> = ({ funders }) => (
  <TableContainer component={Paper}>
    <Table size="small" aria-label="funders" sx={{ minWidth: 300 }}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Country</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {funders.map((funder) => {
          return (
            <TableRow key={funder.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{funder.name}</TableCell>
              <TableCell>{CountryNames[funder.countryCode]}</TableCell>
              <TableCell>{funderTypeToLabel(funder.type)}</TableCell>

              <TableCell>
                <Chip
                  size="small"
                  color={funder.status === Status.ACTIVE ? 'primary' : 'default'}
                  label={statusToLabel(funder.status)}
                />
              </TableCell>
              <TableCell align="right">
                <Link to={`/funders/${funder.id}`}>
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
