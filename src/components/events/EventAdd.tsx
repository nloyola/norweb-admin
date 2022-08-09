import { Alert, Button, CircularProgress, IconButton, Slide, Stack, Typography } from '@mui/material';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import { EventAddForm, EventFormInputs } from './EventAddForm';
import { EventsService } from '@app/services/events/EventsService';
import { EventType } from '@app/models/events';
import { dateToString } from '@app/utils/utils';

export function EventAdd() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = Number(params.projectId);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit: SubmitHandler<EventFormInputs> = (data) => {
    const saveData = async () => {
      try {
        if (data.startDate === null) {
          throw Error('start date is null');
        }

        if (data.endDate === null) {
          throw Error('end date is null');
        }

        setSaving(true);
        await EventsService.add(projectId, {
          title: data.title,
          description: data.description,
          startDate: dateToString(data.startDate),
          endDate: data.endDate ? dateToString(data.endDate) : undefined,
          venue: data.venue,
          organizer: data.organizer,
          url: data.url,
          type: data.type as EventType
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

  if (saving) {
    return <CircularProgress />;
  }

  if (error !== '') {
    return <Alert severity="error">Error in backend adding a project: {error}</Alert>;
  }

  return (
    <Stack spacing={0}>
      <Typography component="h1" variant="h4" my={5}>
        Add an Event
      </Typography>
      <EventAddForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </Stack>
  );
}
