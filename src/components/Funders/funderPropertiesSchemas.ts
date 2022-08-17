import { CountryNames, Status, statusToLabel } from '@app/models';
import { Funder, FunderTypes, funderTypeToLabel } from '@app/models/funders';
import { PropertiesSchema, PropertyTypes } from '../PropertyChanger';

export function funderPropertiesSchemas(funder: Funder): PropertiesSchema {
  return {
    name: {
      propertyName: 'name',
      propertyType: PropertyTypes.TEXT,
      label: 'Funder Name',
      value: funder.name
    },
    acronym: {
      propertyName: 'acronym',
      propertyType: PropertyTypes.TEXT,
      label: 'Acromym',
      value: funder.acronym
    },
    countryCode: {
      propertyName: 'countryCode',
      propertyType: PropertyTypes.AUTO_COMPLETE,
      label: 'Country',
      value: funder.countryCode,
      propertyOptions: Object.entries(CountryNames).map(([id, label]) => ({ id, label }))
    },
    web: {
      propertyName: 'web',
      propertyType: PropertyTypes.TEXT,
      label: 'Website',
      value: funder.web
    },
    type: {
      propertyName: 'type',
      propertyType: PropertyTypes.RADIO,
      label: 'Funder type',
      value: funder.type,
      propertyOptions: Object.values(FunderTypes).map((value) => ({ id: value, label: funderTypeToLabel(value) }))
    },
    status: {
      propertyName: 'status',
      propertyType: PropertyTypes.RADIO,
      label: 'Status',
      value: funder.status,
      propertyOptions: Object.values(Status).map((value) => ({ id: value, label: statusToLabel(value) }))
    }
  };
}
