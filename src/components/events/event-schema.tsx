import { Event, EventType, eventTypeToLabel } from '@app/models/events';
import { nlToFragments } from '@app/utils/nltoFragments';
import { Status, statusToLabel } from '@app/models';
import { PropertiesSchema } from '@app/components/PropertiesGrid/PropertiesGrid';

export function eventPropertySchema(event: Event | null): PropertiesSchema {
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
        startDate: {
            propName: 'startDate',
            label: 'Start Date',
            value: event?.startDate ? new Date(event.startDate).toLocaleDateString() : 'Not available',
            propertyChanger: 'date',
            changerPropsExtra: {
                value: event?.startDate ? new Date(event.startDate).toLocaleDateString() : null,
                maxDate: event?.endDate
            }
        },
        endDate: {
            propName: 'endDate',
            label: 'End Date',
            value: event?.endDate ? new Date(event.endDate).toLocaleDateString() : 'Not available',
            propertyChanger: 'date',
            changerPropsExtra: {
                value: event?.endDate ? new Date(event.endDate).toLocaleDateString() : null,
                minDate: event?.startDate
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
