import { useEffect, useState } from 'react';
import { Alert, CircularProgress, Fab, Grid, Stack } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { EventsService } from '@app/services/events/EventsService';
import { useEvent } from '@app/hooks/useEvent';
import { DateRange, PropertyChanger } from '../PropertyChanger';
import { datesRangeToString, dateToString } from '@app/utils/utils';
import { eventPropertiesSchema } from './eventPropertiesSchemas';
import { EntityProperty } from '../EntityProperty';
import { nlToFragments } from '@app/utils/nltoFragments';
import { eventTypeToLabel } from '@app/models/events';

export function EventDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = Number(params.projectId);
  const eventId = Number(params.eventId);

  const { error, loading, event, loadEvent, updateEvent } = useEvent(projectId, eventId);
  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    loadEvent();
  }, []);

  const onPropChange = (propertyName: string) => {
    setPropertyToUpdate(propertyName);
    setOpen(true);
  };

  const handleClose = <T extends unknown>(propertyName: string, newValue?: T) => {
    const saveData = async () => {
      if (!newValue) {
        return;
      }

      const newValues: any = { ...event };
      if (propertyName === 'duration') {
        const newDates = newValue as DateRange;
        newValues.startDate = dateToString(newDates.startDate);
        newValues.endDate = dateToString(newDates.endDate);
      } else {
        newValues[propertyName] = newValue;
      }

      try {
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

  const backClicked = () => {
    navigate(-1);
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
