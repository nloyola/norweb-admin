import { DomainEntity, IDomainEntity } from '..';

export interface IGroup extends IDomainEntity {
    readonly code: string;
    readonly name: string;
    readonly status: string;
}

export class Group extends DomainEntity {
    readonly code: string;
    readonly name: string;
    readonly status: string;

    deserialize(input: IGroup): this {
        const { code, name, status } = input;
        super.deserialize(input);
        Object.assign(this, { code, name, status });
        return this;
    }
}
