import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { IPerson, Person } from '@app/models/people';
import { ReactElement } from 'react';
import DashboardLayout from '@app/components/DashboardLayout';
import { useRouter } from 'next/router';
import { Alert, Fab, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import PersonBio from '@app/components/people/PersonBio';

function PersonPage({ raw }: { raw: IPerson }) {
    const router = useRouter();
    const backClicked = () => {
        router.back();
    };

    const person = raw === null ? null : new Person().deserialize(raw);

    return (
        <Stack spacing={2}>
            {raw === null && <Alert severity="error">Person does not exist</Alert>}
            {raw && <PersonBio person={person} />}
            <Stack spacing={2} direction="row" mt={2}>
                <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
                    <ArrowBack sx={{ mr: 1 }} />
                    Back
                </Fab>
            </Stack>
        </Stack>
    );
}

PersonPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const res = await fetch(`${process.env.SERVER}/api/people/${params.personId}`);
    const raw = res.status < 400 ? await res.json() : null;
    return {
        props: {
            raw
        }
    };
};

export default PersonPage;
