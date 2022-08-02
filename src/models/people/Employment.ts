import { Group } from './Group';
import { DomainEntity } from '@app/models';
import { EmploymentTitle } from './EmploymentTitle';

export interface Employment extends DomainEntity {
    readonly type: string;
    readonly etitid: number;
    readonly avid: number;
    readonly groupid: number;
    readonly fromDate: Date;
    readonly toDate: Date;
    readonly office: string;
    readonly branch: string;
    readonly updatedAt: Date;
    readonly createdAt: Date;

    readonly title: EmploymentTitle;
    readonly group: Group;
}
