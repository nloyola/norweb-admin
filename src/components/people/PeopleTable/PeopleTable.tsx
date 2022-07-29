import { IPerson, Person } from '@app/models/people';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';

type PeopleTableProps = {
    people: IPerson[];
};

const PeopleTable = ({ people }: PeopleTableProps) => (
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
                {people.map((p, index) => {
                    const person = new Person().deserialize(p);
                    return (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                                    {person.name()}
                                </Box>
                            </TableCell>
                            <TableCell>{person.email}</TableCell>
                            <TableCell align="right">
                                <Link href={`/people/${person.id}`}>
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

export default PeopleTable;
