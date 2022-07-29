import { ReactElement, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { PaginatedResponse } from '../../models';
import { IPerson } from '../../models/people';
import DashboardLayout from '@app/components/DashboardLayout';
import { Box, Fab, IconButton, InputAdornment, Pagination, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { getAsString, useDebounce } from '@app/utils/utils';
import PeopleTable from '@app/components/people/PeopleTable';

const pageUrl = (page?: number, searchTerm?: string): string => {
    const url = '/people/';
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

export const PeoplePage = ({ total, next, results }: PaginatedResponse<IPerson>) => {
    const router = useRouter();
    const routerPage = parseInt(getAsString(router.query.page) || '1');
    const [page, setPage] = useState(routerPage);

    // if response.next is NULL, then user is on LAST PAGE
    const count = next ? Math.ceil(total / results.length) : routerPage;

    const [search, setSearch] = useState(getAsString(router.query.search) || '');
    const debouncedSearchTerm = useDebounce(search, 400);

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setPage(1);
        setSearch(event.target.value);
    };

    useEffect(() => {
        router.push(pageUrl(page, debouncedSearchTerm));
    }, [debouncedSearchTerm]);

    const clearSearch = () => {
        setSearch('');
        setPage(1);
        router.push(pageUrl());
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
                        People
                    </Typography>
                    <Fab color="primary" size="small" aria-label="add" variant="extended">
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
            <PeopleTable people={results} />
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

PeoplePage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ query }: GetServerSidePropsContext) => {
    const page = query.page || '1';
    const search = query.search || '';
    const apiUrl = (server: string, page: string | string[]) => `${server}/api/people/?page=${page}`;
    let url = apiUrl(process.env.SERVER, page);
    if (search !== '') {
        url = `${url}&search=${search}`;
    }

    const res = await fetch(url);
    const response: PaginatedResponse<IPerson> = await res.json();
    return { props: response };
};

export default PeoplePage;
