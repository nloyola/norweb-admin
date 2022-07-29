import { ReactElement } from 'react';
import Head from 'next/head';
import DashboardLayout from '@app/components/DashboardLayout';
import { Box, Paper, Stack, Typography } from '@mui/material';
import EventAddForm from '@app/components/events/EventAddForm';
import { NextPageWithLayout } from '../_app';

const AddEventPage: NextPageWithLayout = () => (
    <Paper
        sx={{
            p: 3
        }}
    >
        <Head>
            <title>Add Event</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Stack spacing={2} mb={2}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Typography component="h1" variant="h4">
                    Add an Event
                </Typography>
            </Box>

            <EventAddForm />
        </Stack>
    </Paper>
);

AddEventPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default AddEventPage;
