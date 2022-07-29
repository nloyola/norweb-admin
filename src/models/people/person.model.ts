import { ConcurrencySafeEntity, Deserializable, IConcurrencySafeEntity } from '@app/models';
import { Employment, IEmployment } from '.';
import { Award, IAward } from './award.model';

export interface IPerson extends IConcurrencySafeEntity {
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

    readonly employments: IEmployment[];
    readonly awards: IAward[];
}

export class Person extends ConcurrencySafeEntity implements IPerson, Deserializable {
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

    deserialize(input: IPerson): this {
        const {
            slug,
            givenNames,
            legalNames,
            honorific,
            personNummer,
            gender,
            email,
            website,
            phone,
            birthDate,
            birthCity,
            birthCountryCode,
            cvBrief,
            cvText,
            msInstitute,
            msYear,
            msCountryCode,
            phdInstitute,
            phdYear,
            phdCountryCode,
            photo
        } = input;

        super.deserialize(input);

        Object.assign(this, {
            slug,
            givenNames,
            legalNames,
            honorific,
            personNummer,
            gender,
            email,
            website,
            phone,
            birthDate,
            birthCity,
            birthCountryCode,
            cvBrief,
            cvText,
            msInstitute,
            msYear,
            msCountryCode,
            phdInstitute,
            phdYear,
            phdCountryCode,
            photo
        });

        if (birthDate) {
            Object.assign(this, { birthDate: new Date(birthDate) });
        }

        if (input.employments) {
            const employments = input.employments.map((emp) => new Employment().deserialize(emp));
            Object.assign(this, { employments });
        }

        if (input.awards) {
            const awards = input.awards.map((emp) => new Award().deserialize(emp));
            Object.assign(this, { awards });
        }

        return this;
    }

    name(): string {
        return this.givenNames + ' ' + this.legalNames;
    }

    researchGroups(): string {
        const groups = this.employments
            ?.filter((emp) => emp.groupid !== null)
            .map((emp) => emp.group?.name)
            .join(', ');
        return groups;
    }

    titles(): string {
        return this.employments?.map((emp) => emp.title.name).join(', ');
    }

    branch(): string | null {
        if (this.employments?.length <= 0) {
            return null;
        }
        return this.employments[0].branch ?? 'Not available';
    }

    office(): string | null {
        if (this.employments?.length <= 0) {
            return null;
        }
        return this.employments[0].office;
    }
}
