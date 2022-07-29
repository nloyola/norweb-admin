import React, { FC } from 'react';
import { Event } from '@app/models/events';
import { Avatar, Divider, Paper, Stack, Typography } from '@mui/material';
import { stringAvatar } from '@app/utils/utils';
import { PropertyChangerProps } from '@app/components/PropertyChanger/PropertyChanger';
import EventsService from '@app/services/events';
import { eventPropertySchema } from './event-schema';
import PropertiesGrid from '@app/components/PropertiesGrid';
import { PropertyChangers, PropertyInfo } from '@app/components/PropertiesGrid/PropertiesGrid';

type EventDetailsProps = {
    event: Event;
};

const saveEvent = async (event: Event): Promise<Event> => {
    try {
        const reply = await new EventsService().update(event);
        return reply;
    } catch (e) {
        console.error(e);
        return null;
    }
};

interface DetailsState<T> {
    open: boolean;
    event: Event;
    propInfo: PropertyInfo<T>;
}

const EventDetails = ({ event: ev }: EventDetailsProps) => {
    if (!ev.id) {
        throw new Error('event is invalid');
    }

    const [state, setState] = React.useState<DetailsState<unknown>>({
        open: false,
        event: ev,
        propInfo: { propName: '', label: '' }
    });

    const onPropChange = (propInfo: PropertyInfo<unknown>) => {
        setState({
            ...state,
            open: true,
            propInfo
        });
    };

    const handleClose = <T extends unknown>(newValue?: T) => {
        if (newValue === null) {
            setState({ ...state, open: false });
            return;
        }

        state.event[state.propInfo.propName] = newValue;
        saveEvent(state.event).then((p) => setState({ ...state, open: false, event: p }));
    };

    const propertyToElement = (propInfo: PropertyInfo<unknown>) => {
        if (PropertyChangers[propInfo.propertyChanger] === undefined) {
            throw Error(`property changer is invalid: ${propInfo.propertyChanger}`);
        }

        const props: PropertyChangerProps<unknown> = {
            title: 'Change Event Settings',
            id: propInfo.propName,
            label: propInfo.label,
            open: state.open,
            onClose: handleClose,
            ...propInfo.changerPropsExtra
        };

        return React.createElement<PropertyChangerProps<unknown>>(
            PropertyChangers[propInfo.propertyChanger] as FC,
            props
        );
    };

    return (
        <Stack spacing={2}>
            <Paper
                sx={{
                    p: 3
                }}
            >
                <Stack spacing={1}>
                    <Stack spacing={1} direction="row">
                        <Avatar {...stringAvatar(state.event.title)}></Avatar>
                        <Stack spacing={0}>
                            <Typography component="h1" variant="h3">
                                {state.event.title}
                            </Typography>
                            <Typography component="h2" variant="subtitle1">
                                Event
                            </Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    <PropertiesGrid schema={eventPropertySchema(state.event)} handleChange={onPropChange} />
                </Stack>
            </Paper>
            {state.open && propertyToElement(state.propInfo)}
        </Stack>
    );
};

export default EventDetails;
