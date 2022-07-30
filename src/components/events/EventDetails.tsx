import { createElement, useContext, useEffect, useState } from 'react';
import { Event } from '@app/models/events';
import { Alert, CircularProgress, Fab, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { PropertyChangerProps } from '@app/components/PropertyChanger/PropertyChanger';
import { PropertiesGrid, PropertyChangers, PropertyInfo } from '@app/components/PropertiesGrid/PropertiesGrid';
import { ProjectContext } from '@app/pages/projects/ProjectPage';
import { useNavigate, useParams } from 'react-router-dom';
import { EventsService } from '@app/services/events/EventsService';
import { eventPropertySchema } from './event-schema';

export function EventDetails() {
    const navigate = useNavigate();
    const params = useParams();

    const { project } = useContext(ProjectContext);
    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState<Event | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [propInfo, setPropInfo] = useState<PropertyInfo<unknown>>({ propName: '', label: '' });

    if (project === undefined || project.name === undefined) {
        navigate('../');
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            if (params.projectId === undefined) {
                return;
            }

            try {
                const raw = await EventsService.get(project.id, params.eventId);
                const e = new Event().deserialize(raw);
                setEvent(e);
            } catch (err) {
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onPropChange = (propInfo: PropertyInfo<unknown>) => {
        setPropInfo(propInfo);
        setOpen(true);
    };

    const handleClose = <T extends unknown>(newValue?: T) => {
        const saveData = async () => {
            if (newValue === null) {
                return;
            }

            try {
                const newValues: any = { ...event };
                newValues[propInfo.propName] = newValue;

                const modifiedEvent = await EventsService.update(project.id, newValues);
                setEvent(modifiedEvent);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setSaving(false);
            }
        };

        setOpen(false);
        saveData();
    };

    const propertyToElement = (propInfo: PropertyInfo<unknown>) => {
        if (PropertyChangers[propInfo.propertyChanger] === undefined) {
            throw Error(`property changer is invalid: ${propInfo.propertyChanger}`);
        }

        const props: PropertyChangerProps<unknown> = {
            title: 'Change Event Settings',
            id: propInfo.propName,
            label: propInfo.label,
            open,
            onClose: handleClose,
            ...propInfo.changerPropsExtra
        };

        return createElement<PropertyChangerProps<unknown>>(PropertyChangers[propInfo.propertyChanger], props);
    };

    const backClicked = () => {
        navigate('../');
    };

    const schema = eventPropertySchema(event);

    return (
        <>
            {(saving || loading) && <CircularProgress />}
            {!saving && error !== '' && <Alert severity="error">Error in backend adding a event: {error}</Alert>}
            {!saving && error === '' && (
                <>
                    <PropertiesGrid schema={schema} handleChange={onPropChange} />
                    <Stack spacing={2} direction="row" mt={2}>
                        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
                            <ArrowBack sx={{ mr: 1 }} />
                            Back
                        </Fab>
                    </Stack>
                    {open && propertyToElement(propInfo)}
                </>
            )}
        </>
    );
}
