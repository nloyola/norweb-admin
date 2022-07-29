import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { IEvent, Event } from '@app/models/events';
import { ReactElement } from 'react';
import DashboardLayout from '@app/components/DashboardLayout';
import { Alert, Fab, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/router';
import EventDetails from '@app/components/events/EventDetails';

function EventPage({ raw }: { raw: IEvent }) {
    const router = useRouter();
    const backClicked = () => {
        router.back();
    };

    const event = raw === null ? null : new Event().deserialize(raw);

    return (
        <Stack spacing={2}>
            {raw === null && <Alert severity="error">Event does not exist</Alert>}
            {raw && <EventDetails event={event} />}
            <Stack spacing={2} direction="row" mt={2}>
                <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
                    <ArrowBack sx={{ mr: 1 }} />
                    Back
                </Fab>
            </Stack>
        </Stack>
    );
}

EventPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const res = await fetch(`${process.env.SERVER}/api/events/${params.eventId}/`);
    const raw = res.status < 400 ? await res.json() : null;
    return {
        props: {
            raw
        }
    };
};

export default EventPage;
