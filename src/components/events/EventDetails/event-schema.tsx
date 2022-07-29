import { Event, EventType, eventTypeToLabel } from '@app/models/events';
import { nlToFragments } from '@app/utils/nltoFragments';
import { Status, statusToLabel } from '@app/models';
import { PropertiesSchema } from '@app/components/PropertiesGrid/PropertiesGrid';

export function eventPropertySchema(event: Event): PropertiesSchema {
    const result: PropertiesSchema = {
        title: {
            propName: 'title',
            label: 'Event Title',
            value: event.title ?? 'Not available',
            propertyChanger: 'text',
            changerPropsExtra: {
                value: event.title
            }
        },
        description: {
            propName: 'description',
            label: 'Description',
            value: nlToFragments(event.description),
            propertyChanger: 'text',
            changerPropsExtra: {
                value: event.description,
                multiline: true
            }
        },
        startDate: {
            propName: 'startDate',
            label: 'Start Date',
            value: event.startDate ? event.startDate.toLocaleDateString() : 'Not available',
            propertyChanger: 'date',
            changerPropsExtra: {
                value: event.startDate ? event.startDate.toLocaleDateString() : null,
                maxDate: event.endDate
            }
        },
        endDate: {
            propName: 'endDate',
            label: 'End Date',
            value: event.endDate ? event.endDate.toLocaleDateString() : 'Not available',
            propertyChanger: 'date',
            changerPropsExtra: {
                value: event.endDate ? event.endDate.toLocaleDateString() : null,
                minDate: event.startDate
            }
        },
        venue: {
            propName: 'venue',
            label: 'Venue',
            value: nlToFragments(event.venue),
            propertyChanger: 'text',
            changerPropsExtra: {
                value: event.venue
            }
        },
        organizer: {
            propName: 'organizer',
            label: 'Organizer',
            value: nlToFragments(event.organizer),
            propertyChanger: 'text',
            changerPropsExtra: {
                value: event.organizer
            }
        },
        url: {
            propName: 'url',
            label: 'Url',
            value: event.url ? event.url : 'Not available',
            propertyChanger: 'text',
            changerPropsExtra: {
                label: 'Url',
                value: event.url
            }
        },
        type: {
            propName: 'type',
            label: 'Event Type',
            value: eventTypeToLabel(event.type) ?? 'Not available',
            propertyChanger: 'radio',
            changerPropsExtra: {
                value: event.type,
                options: Object.values(EventType).map((value) => ({ id: value, label: eventTypeToLabel(value) }))
            }
        },
        status: {
            propName: 'status',
            label: 'Status',
            value: statusToLabel(event.status) ?? 'Not available',
            propertyChanger: 'radio',
            changerPropsExtra: {
                value: event.status,
                options: Object.values(Status).map((value) => ({ id: value, label: statusToLabel(value) }))
            }
        }
    };

    return result;
}
