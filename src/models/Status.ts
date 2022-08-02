export enum Status {
    INACTIVE = 'inactive',
    ACTIVE = 'active'
}

export function statusToLabel(et: Status): string {
    switch (et) {
        case Status.INACTIVE:
            return 'Inactive';
        case Status.ACTIVE:
            return 'Active';
        default:
            throw new Error(`invalid value; ${et}`);
    }
}
