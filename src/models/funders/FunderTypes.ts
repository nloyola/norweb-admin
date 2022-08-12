import { z } from 'zod';

export enum FunderTypes {
  NORDITA = 'nordita',
  UNIVERSITY_OR_RESEARCH_INSTITUTE = 'university-or-research-institute',
  GOVERNMENTAL_FUNDING_AGENCY = 'governmental-funding-agency',
  PRIVATE_FUNDING_AGENCY = 'private-funding-agency',
  OTHER = 'other'
}

export const FunderTypesEnum = z.nativeEnum(FunderTypes);
export type FunderTypesEnum = z.infer<typeof FunderTypesEnum>;

export function funderTypeToLabel(ft: FunderTypes): string {
  switch (ft) {
    case FunderTypes.NORDITA:
      return 'Nordita';
    case FunderTypes.UNIVERSITY_OR_RESEARCH_INSTITUTE:
      return 'University or research institute';
    case FunderTypes.GOVERNMENTAL_FUNDING_AGENCY:
      return 'Governmental funding agency';
    case FunderTypes.PRIVATE_FUNDING_AGENCY:
      return 'Private funding agency';
    case FunderTypes.OTHER:
      return 'Other';

    default:
      throw new Error(`invalid value; ${ft}`);
  }
}
