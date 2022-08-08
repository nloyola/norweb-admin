import { GridItemProperty, GridItemPropertyProps } from '../GridItemProperty';
import {
  PropertyChangerAutocomplete,
  PropertyChangerDate,
  PropertyChangerDateRange,
  PropertyChangerPersonNames,
  PropertyChangerRadio,
  PropertyChangerText
} from '@app/components/PropertyChanger';
import { PropertyOption } from '../PropertyChanger/PropertyChanger';
import { Grid } from '@mui/material';

export const PropertyChangers = {
  autocomplete: PropertyChangerAutocomplete,
  date: PropertyChangerDate,
  dateRange: PropertyChangerDateRange,
  personNames: PropertyChangerPersonNames,
  radio: PropertyChangerRadio,
  text: PropertyChangerText
};

interface ChangerPropsElementExtra<T> {
  label?: string;
  value?: T;
  options?: PropertyOption<T>[];
  multiline?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export interface PropertyInfo<T> extends GridItemPropertyProps {
  propertyChanger?: keyof typeof PropertyChangers;
  changerPropsExtra?: ChangerPropsElementExtra<T>;
}
export type PropertiesSchema = Record<string, PropertyInfo<unknown>>;

type PropertiesGridProps = {
  schema: PropertiesSchema;
  displayOrder: string[];
  handleChange: (propInfo: PropertyInfo<unknown>) => void;
};

export function PropertiesGrid({ schema, displayOrder, handleChange }: PropertiesGridProps) {
  return (
    <Grid container spacing={4}>
      {displayOrder.map((schemaPropName) => {
        const propInfo = schema[schemaPropName];

        if (!propInfo) {
          throw new Error('property not found in schema: ' + schemaPropName);
        }

        if (propInfo.propertyChanger) {
          return <GridItemProperty key={propInfo.propName} {...propInfo} handleChange={handleChange} />;
        }

        return <GridItemProperty key={propInfo.propName} {...propInfo} />;
      })}
    </Grid>
  );
}
