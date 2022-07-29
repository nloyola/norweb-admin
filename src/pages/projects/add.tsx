import { ReactElement } from 'react';
import Head from 'next/head';
import DashboardLayout from '@app/components/DashboardLayout';
import { Box, Paper, Stack, Typography } from '@mui/material';
import ProjectAddForm from '@app/components/projects/ProjectAddForm';
import { NextPageWithLayout } from '../_app';

const AddProjectPage: NextPageWithLayout = () => (
    <Paper
        sx={{
            p: 3
        }}
    >
        <Head>
            <title>Add Project</title>
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
                    Add a Project
                </Typography>
            </Box>

            <ProjectAddForm />
        </Stack>
    </Paper>
);

AddProjectPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export default AddProjectPage;
