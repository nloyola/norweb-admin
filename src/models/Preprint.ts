import { ConcurrencySafeEntity } from '@app/models';

export interface Preprint extends ConcurrencySafeEntity {
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
