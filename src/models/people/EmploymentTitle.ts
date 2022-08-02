import { DomainEntity } from '@app/models';

export interface EmploymentTitle extends DomainEntity {
    readonly name: string;
    readonly status: string;
    readonly ecatid: number;
}
