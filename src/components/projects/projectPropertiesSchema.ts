import { countryCodes, Status, statusToLabel } from '@app/models';
import { Project } from '@app/models/projects';
import { PropertiesSchema, PropertyTypes } from '../PropertyChanger';

export function projectPropertiesSchemas(project: Project): PropertiesSchema {
  return {
    name: {
      propertyName: 'name',
      propertyType: PropertyTypes.TEXT,
      label: 'Project Name',
      value: project.name
    },
    shorthand: {
      propertyName: 'shorthand',
      propertyType: PropertyTypes.TEXT,
      label: 'Shorthand',
      value: project.shorthand
    },
    description: {
      propertyName: 'description',
      propertyType: PropertyTypes.TEXT,
      label: 'Shorthand',
      value: project.description,
      multiline: true
    },
    duration: {
      propertyName: 'duration',
      propertyType: PropertyTypes.DATE_RANGE,
      label: 'Duration',
      value: {
        startDate: new Date(project.startDate),
        endDate: project.endDate ? new Date(project.endDate) : undefined
      }
    },
    goals: {
      propertyName: 'goals',
      propertyType: PropertyTypes.TEXT,
      label: 'Shorthand',
      value: project.goals,
      multiline: true
    },
    vision: {
      propertyName: 'vision',
      propertyType: PropertyTypes.TEXT,
      label: 'Shorthand',
      value: project.vision,
      multiline: true
    },
    countryCode: {
      propertyName: 'countryCode',
      propertyType: PropertyTypes.AUTO_COMPLETE,
      label: 'Country',
      value: project.countryCode,
      propertyOptions: countryCodes.map((country) => ({ id: country.code, label: country.name }))
    },
    status: {
      propertyName: 'status',
      propertyType: PropertyTypes.RADIO,
      label: 'Status',
      value: project.status,
      propertyOptions: Object.values(Status).map((value) => ({ id: value, label: statusToLabel(value) }))
    }
  };
}
