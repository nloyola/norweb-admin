import { ProjectFunder } from '@app/models/projects/ProjectFunder';
import { PropertiesSchema, PropertyTypes } from '../PropertyChanger';

export function projectFunderPropertiesSchemas(pf: ProjectFunder): PropertiesSchema {
  return {
    title: {
      propertyName: 'title',
      propertyType: PropertyTypes.TEXT,
      label: 'Project Title',
      value: pf.title
    },
    funderId: {
      propertyName: 'funderId',
      propertyType: PropertyTypes.FUNDER_ID,
      label: 'FunderId',
      value: pf.funderId
    },
    grantId: {
      propertyName: 'grantId',
      propertyType: PropertyTypes.TEXT,
      label: 'GrantId',
      value: pf.grantId
    },
    grantType: {
      propertyName: 'grantType',
      propertyType: PropertyTypes.TEXT,
      label: 'Grant type',
      value: pf.grantType
    },
    amount: {
      propertyName: 'amount',
      propertyType: PropertyTypes.TEXT,
      label: 'amount',
      value: pf.amount
    },
    duration: {
      propertyName: 'duration',
      propertyType: PropertyTypes.DATE_RANGE,
      label: 'Duration',
      value: {
        startDate: pf.startDate,
        endDate: pf.endDate
      }
    },
    usage: {
      propertyName: 'usage',
      propertyType: PropertyTypes.TEXT,
      label: 'usage',
      value: pf.usage
    },
    comment: {
      propertyName: 'comment',
      propertyType: PropertyTypes.TEXT,
      label: 'comment',
      value: pf.comment,
      multiline: true
    }
  };
}
