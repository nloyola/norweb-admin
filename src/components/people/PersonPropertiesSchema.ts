import { Person, personName } from '@app/models/people';
import { PropertiesSchema, PropertyTypes } from '../PropertyChanger';

export function personPropertiesSchema(person: Person): PropertiesSchema {
  const result: PropertiesSchema = {
    name: {
      propertyName: 'name',
      propertyType: PropertyTypes.PERSON_NAMES,
      label: 'Name',
      value: { givenNames: person.givenNames, familyNames: person.familyNames }
    },
    gender: {
      propertyName: 'gender',
      propertyType: PropertyTypes.RADIO,
      label: 'Gender',
      value: person.gender,
      propertyOptions: [
        { id: 'F', label: 'Female' },
        { id: 'M', label: 'Male' },
        { id: 'O', label: 'Other' }
      ]
    },
    email: {
      propertyName: 'email',
      propertyType: PropertyTypes.TEXT,
      label: 'Email',
      value: person.email
    },
    website: {
      propertyName: 'website',
      propertyType: PropertyTypes.TEXT,
      label: 'Website',
      value: person.website
    },
    telephone: {
      propertyName: 'telephone',
      propertyType: PropertyTypes.TEXT,
      label: 'Telephone',
      value: person.phone
    },
    cvBrief: {
      propertyName: 'cvBrief',
      propertyType: PropertyTypes.TEXT,
      label: 'Brief CV',
      value: person.cvBrief,
      multiline: true
    },
    cvText: {
      propertyName: 'cvText',
      propertyType: PropertyTypes.TEXT,
      label: 'CV',
      value: person.cvText,
      multiline: true
    }
  };

  return result;
}
