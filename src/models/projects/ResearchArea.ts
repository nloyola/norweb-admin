import { DomainEntity, IDomainEntity } from '../domain-entity.model';

export interface IResearchArea extends IDomainEntity {
    readonly name: string;
}

export class ResearchArea extends DomainEntity {
    readonly name: string;

    deserialize(input: IResearchArea): this {
        const { name } = input;

        super.deserialize(input);

        Object.assign(this, {
            name
        });
        return this;
    }
}
