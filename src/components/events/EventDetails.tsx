import { createElement, FC, useContext, useEffect, useState } from 'react';
import { Alert, CircularProgress, Fab, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { PropertyChangerProps } from '@app/components/PropertyChanger/PropertyChanger';
import { PropertiesGrid, PropertyChangers, PropertyInfo } from '@app/components/PropertiesGrid/PropertiesGrid';
import { useNavigate, useParams } from 'react-router-dom';
import { EventsService } from '@app/services/events/EventsService';
import { eventPropertySchema } from './event-schema';
import { useEvent } from '@app/hooks/useEvent';

export function EventDetails() {
    const navigate = useNavigate();
    const params = useParams();
    const projectId = Number(params.projectId);
    const eventId = Number(params.eventId);

    const { error, loading, event, loadEvent, updateEvent } = useEvent(projectId, eventId);
    const [propInfo, setPropInfo] = useState<PropertyInfo<unknown>>({ propName: '', label: '' });
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => loadEvent, []);

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

                const modifiedEvent = await EventsService.update(projectId, newValues);
                updateEvent(modifiedEvent);
            } catch (err) {
                console.error(err);
                setSaveError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setSaving(false);
            }
        };

        setOpen(false);
        saveData();
    };

    const propertyToElement = (propInfo: PropertyInfo<unknown>) => {
        if (propInfo.propertyChanger === undefined) {
            throw new Error('property changer is undefined');
        }
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

        return createElement<PropertyChangerProps<unknown>>(PropertyChangers[propInfo.propertyChanger] as FC, props);
    };

    const backClicked = () => {
        navigate('../');
    };

    if (loading || saving || !event) {
        return <CircularProgress />;
    }

    if (error !== '') {
        return <Alert severity="error">{error}</Alert>;
    }

    if (saveError !== '') {
        return <Alert severity="error">{saveError}</Alert>;
    }

    const schema = eventPropertySchema(event);

    return (
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
    );
}
