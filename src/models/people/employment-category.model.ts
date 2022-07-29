import { DomainEntity, IDomainEntity } from '@app/models';

export interface IEmploymentCategory extends IDomainEntity {
    readonly name: string;
    readonly status: string;
}

export class EmploymentCategory extends DomainEntity {
    readonly name: string;
    readonly status: string;

    deserialize(input: IEmploymentCategory): this {
        const { name, status } = input;
        super.deserialize(input);
        Object.assign(this, { name, status });
        return this;
    }
}
