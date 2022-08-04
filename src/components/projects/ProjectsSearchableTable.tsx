import { PaginatedResponse } from '@app/models';
import { Project } from '@app/models/projects';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { useDebounce } from '@app/utils/utils';
import { Box, Stack, TextField, InputAdornment, IconButton, Alert, CircularProgress, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { ProjectsTable } from './ProjectsTable';

type PaginationData = {
    pagedResults?: PaginatedResponse<Project>;
    count: number;
};

export function ProjectsSearchableTable() {
    const [searchParams, setSearchParams] = useSearchParams({ page: '1', search: '' });

    const paramsPage = searchParams.get('page');
    const paramsSearch = searchParams.get('search');

    const [page, setPage] = useState(paramsPage ? Number(paramsPage) : 1);
    const [search, setSearch] = useState(paramsSearch || '');

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
            const params: any = {};

            if (page > 1) {
                params['page'] = `${page}`;
            }

            if (search && search !== '') {
                params['search'] = search;
            }
            setSearchParams(params);

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
                        <ProjectsTable projects={data.pagedResults?.results || []} />
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
