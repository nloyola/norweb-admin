import { DomainEntity } from '@app/models';

export interface Group extends DomainEntity {
    readonly code: string;
    readonly name: string;
    readonly status: string;
}
