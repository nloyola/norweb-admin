import { Event, EventAdd as EventAddType } from '@app/models/events';
import { EventsService } from '@app/services/events/EventsService';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ShowError } from '../ShowError';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';
import { EventAddForm, EventFormInputs } from './EventAddForm';

export function EventAdd() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = Number(params.projectId);

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const addEvent = useMutation((event: EventAddType) => EventsService.add(projectId, event), {
    onSuccess: (newEvent: Event) => {
      queryClient.setQueryData(['projects', projectId, 'events'], newEvent);
      queryClient.invalidateQueries(['events']);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The event was saved');
      navigate('..');
    }
  });

  const handleSubmit = (data: EventFormInputs) => {
    if (!data.startDate) {
      throw Error('start date is null');
    }

    if (!data.endDate) {
      throw Error('end date is null');
    }

    if (!data.type) {
      throw Error('event type is null');
    }

    const newEvent: EventAddType = { ...data, startDate: data.startDate, type: data.type };
    addEvent.mutate(newEvent);
  };

  const handleCancel = () => {
    navigate('../');
  };

  if (addEvent.isError) {
    return <ShowError error={`Error in backend adding a project: ${addEvent.error}`} />;
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
