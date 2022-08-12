import { z } from 'zod';
import { concurrencySafeEntitySchema } from '../ConcurrencySafeEntity';
import { CountryCodes } from '../CountryCodes';
import { domainEntitySchema } from '../DomainEntity';
import { Employment, employmentSchema } from './Employment';

export const personBriefSchema = domainEntitySchema.extend({
  slug: z.string(),
  givenNames: z.nullable(z.string()),
  familyNames: z.string(),
  email: z.nullable(z.string()),
  photo: z.nullable(z.string()),
  honorific: z.nullable(z.string())
});

export type PersonBrief = z.infer<typeof personBriefSchema>;

export const personSchema = personBriefSchema.merge(concurrencySafeEntitySchema).extend({
  personNummer: z.nullable(z.string()),
  gender: z.nullable(z.string()),
  emailsHistorical: z.nullable(z.string()),
  website: z.nullable(z.string().url()),
  phone: z.nullable(z.string()),
  birthDate: z.nullable(z.preprocess((a) => new Date(z.string().parse(a)), z.date())),
  birthCountryCode: z.nullable(z.nativeEnum(CountryCodes)),
  passportCountryCode: z.nullable(z.nativeEnum(CountryCodes)),
  cvBrief: z.nullable(z.string()),
  cvText: z.nullable(z.string()),

  msInstitute: z.nullable(z.string()),
  msYear: z.nullable(z.number().min(1900).max(2099)),
  msCountryCode: z.nullable(z.nativeEnum(CountryCodes)),

  phdInstitute: z.nullable(z.string()),
  phdYear: z.nullable(z.number().min(1900).max(2099)),
  phdCountryCode: z.nullable(z.nativeEnum(CountryCodes)),

  leaveOfAbsence: z.nullable(z.string()),
  notYetArrived: z.nullable(z.string()),

  employments: z.array(employmentSchema)
});

export type Person = z.infer<typeof personSchema>;

export function personName(person: Person | PersonBrief): string {
  if (person.givenNames && person.givenNames !== '') {
    return person.givenNames + ' ' + person.familyNames;
  }
  return person.familyNames;
}

export function personTitles(person: Person): string {
  return person.employments
    ?.filter((emp: Employment) => emp.title !== undefined)
    .map((emp: Employment) => emp.title?.name)
    .join(', ');
}

export function personBranch(person: Person): string | null {
  if (person.employments?.length <= 0) {
    return null;
  }
  return person.employments[0].branch ?? 'Not available';
}

export function personOffice(person: Person): string | null {
  if (person.employments?.length <= 0) {
    return null;
  }
  return person.employments[0].office;
}
