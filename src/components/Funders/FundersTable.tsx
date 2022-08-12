import { CountryNames } from '@app/models';
import { Funder, funderTypeToLabel } from '@app/models/funders';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const FundersTable: React.FC<{ funders: Funder[] }> = ({ funders }) => (
  <TableContainer component={Paper}>
    <Table size="small" aria-label="funders" sx={{ minWidth: 300 }}>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Country</TableCell>
          <TableCell>Type</TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {funders.map((funder) => {
          return (
            <TableRow key={funder.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 1
                  }}
                >
                  {funder.name}
                </Box>
              </TableCell>
              <TableCell>{CountryNames[funder.countryCode]}</TableCell>
              <TableCell>{funderTypeToLabel(funder.type)}</TableCell>
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
