import { Group, IGroup } from '.';
import { DomainEntity, IDomainEntity } from '..';
import { EmploymentTitle, IEmploymentTitle } from './employment-title.model';

export interface IEmployment extends IDomainEntity {
    readonly type: string;
    readonly etitid: number;
    readonly avid: number;
    readonly groupid: number;
    readonly fromDate: Date;
    readonly toDate: Date;
    readonly office: string;
    readonly branch: string;
    readonly updatedAt: Date;
    readonly createdAt: Date;

    readonly title: IEmploymentTitle;
    readonly group: IGroup;
}

export class Employment extends DomainEntity {
    readonly type: string;
    readonly etitid: number;
    readonly avid: number;
    readonly groupid: number;
    readonly fromDate: Date;
    readonly toDate: Date;
    readonly office: string;
    readonly branch: string;
    readonly updatedAt: Date;
    readonly createdAt: Date;

    readonly title: EmploymentTitle;
    readonly group: Group;

    deserialize(input: IEmployment): this {
        const { type, etitid, avid, groupid, office, branch } = input;
        super.deserialize(input);
        Object.assign(this, { type, etitid, avid, groupid, office, branch });

        if (input.fromDate) {
            Object.assign(this, { fromDate: new Date(input.fromDate) });
        }

        if (input.toDate) {
            Object.assign(this, { toDate: new Date(input.toDate) });
        }

        if (input.title) {
            const title = new EmploymentTitle().deserialize(input.title);
            Object.assign(this, { title });
        }

        if (input.group) {
            Object.assign(this, { group: new Group().deserialize(input.group) });
        }

        return this;
    }
}
