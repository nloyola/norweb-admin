import { DomainEntity } from '@app/models';

export interface Award extends DomainEntity {
    readonly id: number;
    readonly avid: number;
    readonly type: string;
    readonly title: string;
    readonly institute: string;
    readonly country: string;
    readonly year: number;
    readonly updatedAt: Date;
    readonly createdAt: Date;
}
