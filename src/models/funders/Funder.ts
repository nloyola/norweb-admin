import { concurrencySafeEntitySchema } from '../ConcurrencySafeEntity';
import { Status } from '../Status';
import { FunderTypes } from './FunderTypes';
import { CountryCodes } from '../CountryCodes';
import { z } from 'zod';

export const funderSchema = concurrencySafeEntitySchema.extend({
  name: z.string(),
  acronym: z.string(),
  countryCode: z.nativeEnum(CountryCodes),
  web: z.nullable(z.string().url()),
  type: z.nativeEnum(FunderTypes),
  status: z.nativeEnum(Status)
});

export type Funder = z.infer<typeof funderSchema>;

export type FunderAdd = Pick<Funder, 'name' | 'acronym' | 'countryCode' | 'web' | 'type'>;

export type FunderUpdate = FunderAdd & Pick<Funder, 'id' | 'version' | 'status'>;
