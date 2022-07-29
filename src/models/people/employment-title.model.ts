import { DomainEntity, IDomainEntity } from '@app/models';

export interface IEmploymentTitle extends IDomainEntity {
    readonly name: string;
    readonly status: string;
    readonly ecatid: number;
}

export class EmploymentTitle extends DomainEntity {
    readonly name: string;
    readonly status: string;
    readonly ecatid: number;

    deserialize(input: IEmploymentTitle): this {
        const { name, status, ecatid } = input;
        super.deserialize(input);
        Object.assign(this, { name, status, ecatid });
        return this;
    }
}
