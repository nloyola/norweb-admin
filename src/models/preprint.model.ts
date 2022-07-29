import { ConcurrencySafeEntity, Deserializable, IConcurrencySafeEntity } from '@app/models';

export interface IPreprint extends IConcurrencySafeEntity {
    readonly authors: string;
    readonly title: string;
    readonly field: string;
    readonly avid: number;
    readonly report: number;
    readonly submissionDate: Date;
    readonly local: string;
    readonly status: string;
    readonly archive: string;
    readonly doi: string;
    readonly publisher: string;
}

export class Preprint extends ConcurrencySafeEntity implements IPreprint, Deserializable {
    readonly authors: string;
    readonly title: string;
    readonly field: string;
    readonly avid: number;
    readonly report: number;
    readonly submissionDate: Date;
    readonly local: string;
    readonly status: string;
    readonly archive: string;
    readonly doi: string;
    readonly publisher: string;

    deserialize(input: IPreprint): this {
        const { authors, title, field, avid, report, submissionDate, local, status, archive, doi, publisher } = input;

        super.deserialize(input);

        Object.assign(this, {
            authors,
            title,
            field,
            avid,
            report,
            submissionDate,
            local,
            status,
            archive,
            doi,
            publisher
        });

        if (submissionDate) {
            Object.assign(this, { submissionDate: new Date(submissionDate) });
        }

        return this;
    }
}
