import { Alert, Button, CircularProgress, IconButton, Slide, Stack, Typography } from '@mui/material';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useContext, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ProjectContext } from '@app/pages/projects/ProjectPage';
import { EventAddForm, EventFormInputs } from './EventAddForm';
import { EventsService } from '@app/services/events/EventsService';
import { EventType } from '@app/models/events';

export function EventAdd() {
    const navigate = useNavigate();
    const { project } = useContext(ProjectContext);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit: SubmitHandler<EventFormInputs> = (data) => {
        const saveData = async () => {
            try {
                if (!project || !project.id) {
                    return;
                }

                if (data.startDate === null) {
                    throw Error('start date is null');
                }

                if (data.endDate === null) {
                    throw Error('end date is null');
                }

                setSaving(true);
                await EventsService.add(project.id, {
                    id: 0,
                    title: data.title,
                    description: data.description,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    venue: data.venue,
                    organizer: data.organizer,
                    url: data.url,
                    type: data.type as EventType,
                    projectId: 0
                });

                const action = (key: SnackbarKey) => (
                    <Button onClick={() => closeSnackbar(key)}>
                        <IconButton color="default" aria-label="close button" component="span" size="small">
                            <CloseIcon />
                        </IconButton>
                    </Button>
                );

                navigate('../');

                enqueueSnackbar('The event was saved', {
                    action,
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    TransitionComponent: Slide
                });
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setSaving(false);
            }
        };

        saveData();
    };

    const handleCancel = () => {
        navigate('../');
    };

    return (
        <>
            {saving && <CircularProgress />}
            {!saving && error !== '' && <Alert severity="error">Error in backend adding a project: {error}</Alert>}
            {!saving && error === '' && (
                <Stack spacing={0}>
                    <Typography component="h1" variant="h4" my={5}>
                        Add an Event
                    </Typography>
                    <EventAddForm onSubmit={handleSubmit} onCancel={handleCancel} />
                </Stack>
            )}
        </>
    );
}
