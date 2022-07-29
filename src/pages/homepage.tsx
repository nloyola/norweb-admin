import DashboardLayout from '@app/components/DashboardLayout';
import { Box, Container, Typography } from '@mui/material';
import { ReactElement } from 'react';

export function HomePage() {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    my: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Typography component="h1" color="primary">
                    Norweb Admin
                </Typography>
            </Box>
        </Container>
    );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};
