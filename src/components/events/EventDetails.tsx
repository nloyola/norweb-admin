import { useEvent } from '@app/hooks/useEvent';
import { Event, eventTypeToLabel } from '@app/models/events';
import { EventsService } from '@app/services/events/EventsService';
import { nlToFragments } from '@app/utils/nltoFragments';
import { datesRangeToString } from '@app/utils/utils';
import { ArrowBack } from '@mui/icons-material';
import { CircularProgress, Fab, Grid, Stack } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityProperty } from '../EntityProperty';
import { DateRange, PropertyChanger } from '../PropertyChanger';
import { ShowError } from '../ShowError';
import { eventPropertiesSchema } from './eventPropertiesSchemas';

export function EventDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = Number(params.projectId);
  const eventId = Number(params.eventId);

  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { error, isError, isLoading, data: event } = useEvent(projectId, eventId);
  const queryClient = useQueryClient();

  const updateEvent = useMutation((event: Event) => EventsService.update(projectId, event), {
    onSuccess: (newEvent: Event) => {
      queryClient.setQueryData(['projects', projectId, 'events', eventId], newEvent);
      queryClient.invalidateQueries(['projects', projectId]);
    }
  });

  const onPropChange = (propertyName: string) => {
    setPropertyToUpdate(propertyName);
    setOpen(true);
  };

  const handleClose = <T extends unknown>(propertyName: string, newValue?: T) => {
    setOpen(false);
    if (!newValue) {
      return;
    }

    if (!event) {
      throw new Error('event is invalid');
    }

    const newValues = { ...event };
    if (propertyName === 'duration') {
      const newDates = newValue as DateRange;
      newValues.startDate = newDates.startDate;
      newValues.endDate = newDates.endDate;
    } else {
      // see https://bobbyhadz.com/blog/typescript-create-type-from-object-keys
      newValues[propertyName as keyof Event] = newValue as keyof Event[keyof Event];
    }

    updateEvent.mutate(newValues);
  };

  const backClicked = () => {
    navigate(-1);
  };

  if (isError) {
    return <ShowError error={error} />;
  }

  if (updateEvent.isError) {
    return <ShowError error={updateEvent.error} />;
  }

  if (isLoading || !event) {
    return <CircularProgress />;
  }

  const schemas = eventPropertiesSchema(event);

  return (
    <>
      <Grid container spacing={4}>
        <EntityProperty propName="title" label="Event title" value={event.title} handleChange={onPropChange} />
        <EntityProperty
          propName="description"
          label="Description"
          value={event.description ? nlToFragments(event.description) : null}
          handleChange={onPropChange}
        />
        <EntityProperty
          propName="duration"
          label="Duration"
          value={datesRangeToString(event.startDate, event.endDate)}
          handleChange={onPropChange}
        />
        <EntityProperty propName="venue" label="Venue" value={event.venue} handleChange={onPropChange} />
        <EntityProperty propName="organizer" label="Organizer" value={event.organizer} handleChange={onPropChange} />
        <EntityProperty propName="url" label="Website" value={event.url} handleChange={onPropChange} />
        <EntityProperty
          propName="type"
          label="Type"
          value={event.type ? eventTypeToLabel(event.type) : undefined}
          handleChange={onPropChange}
        />
      </Grid>
      <Stack spacing={2} direction="row" mt={2}>
        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
          <ArrowBack sx={{ mr: 1 }} />
          Back
        </Fab>
      </Stack>
      {open && propertyToUpdate && schemas[propertyToUpdate].propertyType && (
        <PropertyChanger
          title={'Event: change settings'}
          {...schemas[propertyToUpdate]}
          open={open}
          onClose={handleClose}
        />
      )}
    </>
  );
}
