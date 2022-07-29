import { IEvent } from '@app/models/events';
import { Box, Fab, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { useState } from 'react';
import EventsTable from '@app/components/events/EventsTable';

type ProjectEventsProps = {
    events: IEvent[];
    onAdd: () => void;
};

const ProjectEvents = ({ events, onAdd }: ProjectEventsProps) => {
    const [search, setSearch] = useState('');

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleAddClicked = () => {
        onAdd();
    };

    const clearSearch = () => {
        setSearch('');
    };

    return (
        <>
            <Stack spacing={2} mb={2}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Typography component="h1" variant="h4">
                        &nbsp;
                    </Typography>
                    <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={handleAddClicked}>
                        <AddIcon sx={{ mr: 1 }} />
                        Add
                    </Fab>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <TextField
                        label="Search"
                        value={search}
                        onChange={handleSearchTermChange}
                        fullWidth
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onMouseDown={clearSearch}
                                        edge="end"
                                    >
                                        <HighlightOffSharpIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </Stack>
            <EventsTable events={events} />
        </>
    );
};

export default ProjectEvents;
