import { Event, EventType, eventTypeToLabel } from '@app/models/events';
import { PropertiesSchema, PropertyTypes } from '../PropertyChanger';

export function eventPropertiesSchema(event: Event): PropertiesSchema {
  const result: PropertiesSchema = {
    title: {
      propertyName: 'title',
      propertyType: PropertyTypes.TEXT,
      label: 'Event Title',
      value: event.title
    },
    description: {
      propertyName: 'description',
      propertyType: PropertyTypes.TEXT,
      label: 'Description',
      value: event.description,
      multiline: true
    },
    duration: {
      propertyName: 'duration',
      propertyType: PropertyTypes.DATE_RANGE,
      label: 'Duration',
      value: {
        startDate: new Date(event.startDate),
        endDate: event.endDate ? new Date(event.endDate) : undefined
      }
    },
    venue: {
      propertyName: 'venue',
      propertyType: PropertyTypes.TEXT,
      label: 'Venue',
      value: event.venue
    },
    organizer: {
      propertyName: 'organizer',
      propertyType: PropertyTypes.TEXT,
      label: 'Organizer',
      value: event.organizer
    },
    url: {
      propertyName: 'url',
      propertyType: PropertyTypes.TEXT,
      label: 'Url',
      value: event.url
    },
    type: {
      propertyName: 'type',
      propertyType: PropertyTypes.RADIO,
      label: 'Event Type',
      value: event.type,
      propertyOptions: Object.values(EventType).map((value) => ({ id: value, label: eventTypeToLabel(value) }))
    }
  };

  return result;
}
