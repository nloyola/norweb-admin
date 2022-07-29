import { Deserializable } from '@app/models';

export interface IPreprintMetadata {
    fields: number[];
    minYear: number;
    maxYear: number;
}

export class PreprintMetadata implements IPreprintMetadata, Deserializable {
    fields: number[];
    minYear: number;
    maxYear: number;

    deserialize(input: IPreprintMetadata): this {
        const { fields, minYear, maxYear } = input;
        Object.assign(this, { fields, minYear, maxYear });
        return this;
    }
}
