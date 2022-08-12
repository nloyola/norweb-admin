import { domainEntitySchema } from './DomainEntity';
import { z } from 'zod';

export const concurrencySafeEntitySchema = domainEntitySchema.extend({
  /**
   * The current version for the object. Used for optimistic concurrency versioning.
   */
  version: z.number().min(0),

  /**
   * The date and time, in ISO time format, when this entity was added to the system.
   */
  createdAt: z.preprocess((a) => new Date(z.string().parse(a)), z.date()),

  /**
   * The date and time, in ISO time format, when this entity was last updated.
   */
  updatedAt: z.nullable(z.preprocess((a) => new Date(z.string().parse(a)), z.date()))
});

export type ConcurrencySafeEntity = z.infer<typeof concurrencySafeEntitySchema>;
