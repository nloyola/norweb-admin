export enum EventType {
    NORDITA_PROGRAM = 'nordita-program',
    CONFERENCE = 'conference',
    WORKSHOP = 'workshop',
    MEETING = 'meeting',
    SCHOOL = 'school',
    OUTREACH = 'outreach',
    INVITED_TALK_OR_SEMINAR = 'invited-talk-or-seminar',
    OTHER = 'other'
}

export function eventTypeToLabel(et: EventType): string {
    switch (et) {
        case EventType.NORDITA_PROGRAM:
            return 'Nordita program';
        case EventType.CONFERENCE:
            return 'Conference';
        case EventType.WORKSHOP:
            return 'Workshop';
        case EventType.MEETING:
            return 'Meeting';
        case EventType.SCHOOL:
            return 'School';
        case EventType.OUTREACH:
            return 'Outreach';
        case EventType.INVITED_TALK_OR_SEMINAR:
            return 'Invited talk or seminar';
        case EventType.OTHER:
            return 'Other';
        default:
            throw new Error(`invalid value; ${et}`);
    }
}
