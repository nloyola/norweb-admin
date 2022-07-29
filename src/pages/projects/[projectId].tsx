import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { IProject, Project } from '@app/models/projects';
import { ReactElement } from 'react';
import DashboardLayout from '@app/components/DashboardLayout';
import { Alert, Fab, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/router';
import ProjectDetails from '@app/components/projects/ProjectDetails';

function ProjectPage({ raw }: { raw: IProject }) {
    const router = useRouter();
    const backClicked = () => {
        router.back();
    };

    const project = raw === null ? null : new Project().deserialize(raw);

    return (
        <Stack spacing={2}>
            {raw === null && <Alert severity="error">Project does not exist</Alert>}
            {raw && <ProjectDetails project={project} />}
            <Stack spacing={2} direction="row" mt={2}>
                <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
                    <ArrowBack sx={{ mr: 1 }} />
                    Back
                </Fab>
            </Stack>
        </Stack>
    );
}

ProjectPage.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const res = await fetch(`${process.env.SERVER}/api/projects/${params.projectId}/`);
    const raw = res.status < 400 ? await res.json() : null;
    return {
        props: {
            raw
        }
    };
};

export default ProjectPage;
