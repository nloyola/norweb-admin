import { z } from 'zod';
import { EventType } from './EventType';
import { domainEntitySchema } from '@app/models';

export const eventBriefSchema = domainEntitySchema.extend({
  title: z.string(),
  startDate: z.preprocess((a) => new Date(z.string().parse(a)), z.date()),
  endDate: z.nullable(z.preprocess((a) => new Date(z.string().parse(a)), z.date())),
  url: z.string().url().nullable(),
  type: z.nativeEnum(EventType)
});

export const eventSchema = eventBriefSchema.extend({
  description: z.string().nullable(),
  venue: z.string().nullable(),
  organizer: z.string().nullable(),
  projectId: z.number().min(1).nullable()
});

export type EventBrief = z.infer<typeof eventBriefSchema>;

export type Event = z.infer<typeof eventSchema>;

export type EventAdd = Pick<
  Event,
  'title' | 'description' | 'startDate' | 'endDate' | 'venue' | 'organizer' | 'url' | 'type'
>;

export type EventUpdate = EventAdd & Pick<Event, 'id'>;
