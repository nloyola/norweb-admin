import { Event, EventType, eventTypeToLabel } from '@app/models/events';
import { nlToFragments } from '@app/utils/nltoFragments';
import { PropertiesSchema } from '@app/components/PropertiesGrid/PropertiesGrid';
import { datesRangeToString } from '@app/utils/utils';

export function eventPropertySchema(event: Event): PropertiesSchema {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const result: PropertiesSchema = {
    title: {
      propName: 'title',
      label: 'Event Title',
      value: event?.title ?? 'Not available',
      propertyChanger: 'text',
      changerPropsExtra: {
        value: event?.title
      }
    },
    description: {
      propName: 'description',
      label: 'Description',
      value: event?.description ? nlToFragments(event?.description) : 'Not available',
      propertyChanger: 'text',
      changerPropsExtra: {
        value: event?.description,
        multiline: true
      }
    },
    duratrion: {
      propName: 'duration',
      label: 'Duration',
      value: datesRangeToString(startDate, endDate),
      propertyChanger: 'dateRange',
      changerPropsExtra: {
        value: { startDate, endDate }
      }
    },
    venue: {
      propName: 'venue',
      label: 'Venue',
      value: event?.venue ? nlToFragments(event?.venue) : 'Not available',
      propertyChanger: 'text',
      changerPropsExtra: {
        value: event?.venue
      }
    },
    organizer: {
      propName: 'organizer',
      label: 'Organizer',
      value: event?.organizer ? nlToFragments(event?.organizer) : 'Not available',
      propertyChanger: 'text',
      changerPropsExtra: {
        value: event?.organizer
      }
    },
    url: {
      propName: 'url',
      label: 'Url',
      value: event?.url ? event?.url : 'Not available',
      propertyChanger: 'text',
      changerPropsExtra: {
        label: 'Url',
        value: event?.url
      }
    },
    type: {
      propName: 'type',
      label: 'Event Type',
      value: event?.type ? eventTypeToLabel(event?.type) : 'Not available',
      propertyChanger: 'radio',
      changerPropsExtra: {
        value: event?.type,
        options: Object.values(EventType).map((value) => ({ id: value, label: eventTypeToLabel(value) }))
      }
    }
  };

  return result;
}
