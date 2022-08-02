import { ConcurrencySafeEntity } from '../ConcurrencySafeEntity';
import { Award } from './Award';
import { Employment } from './Employment';

export interface Person extends ConcurrencySafeEntity {
    readonly slug: string;
    readonly givenNames: string;
    readonly legalNames: string;
    readonly honorific: string;
    readonly personNummer: string;
    readonly gender: string;
    readonly email: string;
    readonly website: string;
    readonly phone: string;
    readonly birthDate: Date;
    readonly birthCity: string;
    readonly birthCountryCode: string;
    readonly cvBrief: string;
    readonly cvText: string;
    readonly msInstitute: string;
    readonly msYear: number;
    readonly msCountryCode: string;
    readonly phdInstitute: string;
    readonly phdYear: number;
    readonly phdCountryCode: string;
    readonly photo: string;

    readonly employments: Employment[];
    readonly awards: Award[];
}

export function personName(person: Person): string {
    if (person.givenNames && person.givenNames !== '') {
        return person.givenNames + ' ' + person.legalNames;
    }
    return person.legalNames;
}

export function personTitles(person: Person): string {
    return person.employments?.map((emp) => emp.title.name).join(', ');
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
