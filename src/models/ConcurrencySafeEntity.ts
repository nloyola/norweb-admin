import { DomainEntity } from './DomainEntity';

export interface ConcurrencySafeEntity extends DomainEntity {
  /**
   * The current version for the object. Used for optimistic concurrency versioning.
   */
  readonly version: number;

  /**
   * The date and time, in ISO time format, when this entity was added to the system.
   */
  readonly createdAt: string;

  /**
   * The date and time, in ISO time format, when this entity was last updated.
   */
  readonly updatedAt: string | null;
}
