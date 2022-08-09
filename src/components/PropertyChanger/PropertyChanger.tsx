import { ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { PropertyChangerAutocomplete } from './PropertyChangerAutocomplete';
import { PropertyChangerDate } from './PropertyChangerDate';
import { PropertyChangerDateRange } from './PropertyChangerDateRange';
import { PropertyChangerPersonNames } from './PropertyChangerPersonNames';
import { PropertyChangerRadio } from './PropertyChangerRadio';
import { PropertyChangerText } from './PropertyChangerText';

export enum PropertyTypes {
  AUTO_COMPLETE = 'autocomplete,',
  DATE_RANGE = 'date-range,',
  DATE = 'date,',
  PERSON_NAMES = 'person-names,',
  PROJECT_KEYWORD = 'project-keyword,',
  RADIO = 'radio,',
  TEXT = 'text'
}

export interface PropertySchema<T> {
  propertyName: string;
  propertyType?: PropertyTypes;
  label: string;
  value?: T;
  handleChange?: (propertyName: string) => void;

  propertyOptions?: PropertyOption<T>[];
  multiline?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export type PropertiesSchema = Record<string, PropertySchema<unknown>>;

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PersonNames {
  givenNames: string;
  familyNames: string;
}

export interface PropertyOption<T> {
  id: T;
  label: string;
}

export interface PropertyChangerProps<T> {
  propertyName: string;
  propertyType?: PropertyTypes;
  title: string;
  label: string;
  open: boolean;
  onClose: (propertyName: string, value?: T) => void;
  value?: T;
  propertyOptions?: PropertyOption<T>[];
}

export interface PropertyChangerDateRangeProps extends PropertyChangerProps<DateRange> {}

export interface PropertyChangerDateProps extends PropertyChangerProps<Date> {
  minDate?: Date;
  maxDate?: Date;
}

export interface PropertyChangerPersonNamesProps extends PropertyChangerProps<PersonNames> {}

export interface PropertyChangerProjectKeywordProps extends PropertyChangerProps<ProjectKeywordUpdate> {}

export interface PropertyChangerTextProps extends PropertyChangerProps<string> {
  multiline: boolean;
}

export function PropertyChanger<T extends PropertyChangerProps<unknown>>(props: T) {
  switch (props.propertyType) {
    case PropertyTypes.AUTO_COMPLETE:
      return <PropertyChangerAutocomplete {...props} />;

    case PropertyTypes.DATE_RANGE:
      const dateRangeProps = props as PropertyChangerDateRangeProps;
      return <PropertyChangerDateRange {...dateRangeProps} />;

    case PropertyTypes.DATE:
      const dateProps = props as PropertyChangerDateProps;
      return <PropertyChangerDate {...dateProps} />;

    case PropertyTypes.PERSON_NAMES:
      const namesProps = props as PropertyChangerPersonNamesProps;
      return <PropertyChangerPersonNames {...namesProps} />;

    case PropertyTypes.TEXT:
      const textProps = props as unknown as PropertyChangerTextProps;
      return <PropertyChangerText {...textProps} />;

    case PropertyTypes.RADIO:
      return <PropertyChangerRadio {...props} />;
  }

  throw new Error('invalid property type: ' + props.propertyType);
}
