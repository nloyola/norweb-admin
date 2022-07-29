import { ReactElement, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { PaginatedResponse } from '@app/models';
import { IProject } from '@app/models/projects';
import DashboardLayout from '@app/components/DashboardLayout';
import { Box, Fab, IconButton, InputAdornment, Pagination, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { getAsString, useDebounce } from '@app/utils/utils';
import ProjectsTable from '@app/components/projects/ProjectsTable';

const pageUrl = (page: number, searchTerm?: string): string => {
    const url = '/projects/';
    const queryParams = [];

    if (page && page > 1) {
        queryParams.push(`page=${page}`);
    }
    if (searchTerm && searchTerm !== '') {
        queryParams.push(`search=${searchTerm}`);
    }
    if (queryParams.length > 0) {
        return `${url}?` + queryParams.join('&');
    }
    return url;
};

const ProjectsPage = ({ total, next, results }: PaginatedResponse<IProject>) => {
    const router = useRouter();
    const routerPage = parseInt(getAsString(router.query.page) || '1');
    const [page, setPage] = useState(routerPage);

    // if response.next is NULL, then user is on LAST PAGE
    const count = next ? Math.ceil(total / results.length) : routerPage;

    const [search, setSearch] = useState(getAsString(router.query.search) || '');
    const debouncedSearchTerm = useDebounce(search, 400);

    const handleAddClicked = () => {
        router.push('/projects/add');
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPage(1);
        setSearch(event.target.value);
    };

    useEffect(() => {
        router.push(pageUrl(page, debouncedSearchTerm));
    }, [debouncedSearchTerm]);

    const clearSearch = () => {
        setSearch('');
        setPage(1);
        router.push(pageUrl(page));
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        router.push(pageUrl(value));
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
                        Projects
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
            <ProjectsTable projects={results} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 2
                }}
            >
                <Pagination count={count} page={routerPage} boundaryCount={2} onChange={handlePageChange} />
            </Box>
        </>
    );
};

ProjectsPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ query }: GetServerSidePropsContext) => {
    const page = query.page || '1';
    const search = query.search || '';
    const apiUrl = (server: string, page: string | string[]) => `${server}/api/projects/?page=${page}`;
    let url = apiUrl(process.env.SERVER, page);
    if (search !== '') {
        url = `${url}&search=${search}`;
    }

    const res = await fetch(url);
    const response: PaginatedResponse<IProject> = await res.json();
    return { props: response };
};

export default ProjectsPage;
