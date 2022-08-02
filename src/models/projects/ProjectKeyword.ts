import { DomainEntity } from '@app/models';

export interface IProjectKeyword extends DomainEntity {
    readonly name: string;
    readonly weight: number;
    readonly projectId: number;
}
