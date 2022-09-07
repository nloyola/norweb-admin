import { z } from 'zod';
import { concurrencySafeEntitySchema } from '../ConcurrencySafeEntity';
import { Status } from '../Status';

export const researchAreaSchema = concurrencySafeEntitySchema.extend({
  name: z.string(),
  status: z.nativeEnum(Status)
});

export type ResearchArea = z.infer<typeof researchAreaSchema>;

export type ResearchAreaAdd = Pick<ResearchArea, 'name'>;

export type ResearchAreaUpdate = ResearchAreaAdd & Pick<ResearchArea, 'id' | 'version' | 'status'>;
