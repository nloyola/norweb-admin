import { DomainEntity, IDomainEntity } from '..';

export interface IAward extends IDomainEntity {
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

export class Award extends DomainEntity {
    readonly id: number;
    readonly avid: number;
    readonly type: string;
    readonly title: string;
    readonly institute: string;
    readonly country: string;
    readonly year: number;
    readonly updatedAt: Date;
    readonly createdAt: Date;

    deserialize(input: IAward): this {
        const { id, avid, type, title, institute, country, year } = input;
        super.deserialize(input);
        Object.assign(this, { id, avid, type, title, institute, country, year });

        return this;
    }
}
