import EventAddForm from '@app/components/events/EventAddForm';
import { EventFormInputs } from '@app/components/events/EventAddForm/EventAddForm';
import { Project } from '@app/models/projects';
import { Button, IconButton, Slide } from '@mui/material';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import ProjectEvents from './ProjectEvents';
import CloseIcon from '@mui/icons-material/Close';
import { Status } from '@app/models';
import EventsService from '@app/services/events';
import { Event } from '@app/models/events';
import { useRouter } from 'next/router';

const saveEvent = async (values: EventFormInputs): Promise<boolean> => {
    const event = new Event().deserialize({
        ...values,
        status: Status.INACTIVE,
        version: 0,
        createdAt: new Date(),
        updatedAt: null
    });

    return new EventsService().add(event);
};

type ProjectEventsTabProps = {
    project: Project;
};

const ProjectEventsTab = ({ project }: ProjectEventsTabProps) => {
    const router = useRouter();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [state, setState] = useState<'table' | 'add'>('table');

    const handleAdd = () => {
        setState('add');
    };

    const handleSubmit: SubmitHandler<EventFormInputs> = (data) => {
        setState('table');
        saveEvent(data).then((result) => {
            if (result === false) {
                router.push('/500');
                return;
            }

            const action = (key: SnackbarKey) => (
                <Button onClick={() => closeSnackbar(key)}>
                    <IconButton color="default" aria-label="close button" component="span" size="small">
                        <CloseIcon />
                    </IconButton>
                </Button>
            );

            enqueueSnackbar('The event was saved', {
                action,
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                },
                TransitionComponent: Slide
            });
        });
    };

    const handleCancel = () => {
        setState('table');
    };

    return (
        <>
            {state === 'table' && <ProjectEvents events={project.events} onAdd={handleAdd} />}
            {state === 'add' && <EventAddForm onSubmit={handleSubmit} onCancel={handleCancel} />}
        </>
    );
};

export default ProjectEventsTab;
