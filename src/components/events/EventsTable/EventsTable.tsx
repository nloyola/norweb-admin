import { IEvent, Event } from '@app/models/events';
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
import Link from 'next/link';

type EventsTableProps = {
    events: IEvent[];
};

const EventsTable = ({ events }: EventsTableProps) => {
    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="events" sx={{ minWidth: 300 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Venue</TableCell>
                        <TableCell>Organizer</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((p, index) => {
                        const event = new Event().deserialize(p);
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
                                        <Avatar {...stringAvatar(event.title, 10, 24, 24)}></Avatar>
                                        {event.title}
                                    </Box>
                                </TableCell>
                                <TableCell>{event.venue}</TableCell>
                                <TableCell>{event.organizer}</TableCell>
                                <TableCell>{event.startDate.toLocaleDateString()}</TableCell>
                                <TableCell>{event.endDate.toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <Link href={`/events/${event.id}`}>
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

export default EventsTable;
