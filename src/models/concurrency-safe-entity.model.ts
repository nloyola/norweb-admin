import { Deserializable } from './deserializable.model';
import { DomainEntity, IDomainEntity } from './domain-entity.model';

export interface IConcurrencySafeEntity extends IDomainEntity {
    /**
     * The current version for the object. Used for optimistic concurrency versioning.
     */
    readonly version: number;

    /**
     * The date and time, in ISO time format, when this entity was added to the system.
     */
    readonly createdAt: Date;

    /**
     * The date and time, in ISO time format, when this entity was last updated.
     */
    readonly updatedAt: Date | null;
}

export abstract class ConcurrencySafeEntity extends DomainEntity implements Deserializable {
    readonly version: number;
    readonly createdAt: Date;
    readonly updatedAt: Date | null;

    deserialize(input: IConcurrencySafeEntity): this {
        const { version, createdAt, updatedAt } = input;

        if (createdAt) {
            Object.assign(this, { createdAt: new Date(createdAt) });
        }

        if (updatedAt) {
            Object.assign(this, { updatedAt: new Date(updatedAt) });
        }

        Object.assign(this, { version });
        super.deserialize(input);
        return this;
    }
}
