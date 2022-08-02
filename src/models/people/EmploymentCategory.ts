import { DomainEntity } from '@app/models';

export interface EmploymentCategory extends DomainEntity {
    readonly name: string;
    readonly status: string;
}
