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
import { Person, personName } from '@app/models/people';

type PeopleTableProps = {
    page: number;
    search: string;
    people: Person[];
};

export function PeopleTable({ page, search, people }: PeopleTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="people" sx={{ minWidth: 300 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {people.map((person) => {
                        return (
                            <TableRow key={person.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            gap: 1
                                        }}
                                    >
                                        <Avatar variant="rounded" src={person.photo} sx={{ width: 24, height: 24 }} />
                                        {personName(person)}
                                    </Box>
                                </TableCell>
                                <TableCell>{person.email}</TableCell>
                                <TableCell align="right">
                                    <Link to={`/people/${person.id}`} state={{ page, search }}>
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
