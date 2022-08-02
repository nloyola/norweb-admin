import { PaginatedResponse } from '@app/models';
import { Project } from '@app/models/projects';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { stringAvatar, useDebounce } from '@app/utils/utils';
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
    Stack,
    TextField,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    Pagination
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';

type LocationState = {
    page?: number;
    search?: string;
};

type PaginationData = {
    pagedResults?: PaginatedResponse<Project>;
    count: number;
};

export function ProjectsTable() {
    const location = useLocation();
    const paginationState = location.state as LocationState;

    const [page, setPage] = useState(paginationState?.page || 1);
    const [search, setSearch] = useState(paginationState?.search || '');
    const [data, setData] = useState<PaginationData>({ count: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const debouncedSearchTerm = useDebounce(search, 400);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        if (page !== newPage) {
            setPage(newPage);
        }
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const clearSearch = () => {
        setSearch('');
        setPage(1);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // if response.next is NULL, then user is on LAST PAGE
                const pagedResults = await ProjectsService.paginate(page, search);
                setData({
                    ...data,
                    pagedResults,
                    count: pagedResults.next ? Math.ceil(pagedResults.total / pagedResults.results.length) : page
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page, debouncedSearchTerm]);

    return (
        <>
            <Stack spacing={2} mb={2}>
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
                {!loading && error !== '' && <Alert severity="error">{error}</Alert>}
                {loading && <CircularProgress />}
                {!loading && error === '' && (
                    <>
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
                                    {(data.pagedResults?.results || []).map((project, index) => {
                                        return (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
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
                                                    {new Date(project.startDate).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                                                <TableCell align="right">
                                                    <Link to={`/projects/${project.id}`} state={{ page, search }}>
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
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 2
                            }}
                        >
                            <Pagination count={data.count} page={page} boundaryCount={2} onChange={handlePageChange} />
                        </Box>
                    </>
                )}
            </Stack>
        </>
    );
}
