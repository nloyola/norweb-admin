import { GridItemProperty, GridItemPropertyProps } from '../GridItemProperty';
import {
    PropertyChangerAutocomplete,
    PropertyChangerDate,
    PropertyChangerRadio,
    PropertyChangerText
} from '@app/components/PropertyChanger';
import { PropertyChangerProps, PropertyOption } from '../PropertyChanger/PropertyChanger';
import { Alert, CircularProgress, createTheme, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { grey } from '@mui/material/colors';
import { createElement, useContext, useState } from 'react';
import { ProjectContext } from '@app/pages/projects/ProjectPage';
import { projectPropertySchema } from '../projects/ProjectDetails/project-schema';
import { useNavigate } from 'react-router-dom';
import { ProjectsService } from '@app/services/projects/ProjectsService';

export const PropertyChangers = {
    autocomplete: PropertyChangerAutocomplete,
    date: PropertyChangerDate,
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

const theme = createTheme({
    components: {
        MuiTypography: {
            variants: [
                {
                    props: {
                        variant: 'subtitle1'
                    },
                    style: {
                        color: grey[600]
                    }
                },
                {
                    props: {
                        variant: 'subtitle2'
                    },
                    style: {
                        fontSize: '0.8rem',
                        color: 'black'
                    }
                }
            ]
        }
    }
});

type PropertiesGridProps = {
    schema: PropertiesSchema;
    handleChange: (propInfo: PropertyInfo<unknown>) => void;
};

export function PropertiesGrid({ schema, handleChange }: PropertiesGridProps) {
    return (
        <Grid container spacing={4}>
            <ThemeProvider theme={theme}>
                {schema &&
                    Object.values(schema).map((propInfo) => (
                        <GridItemProperty key={propInfo.propName} {...propInfo} handleChange={handleChange} />
                    ))}
            </ThemeProvider>
        </Grid>
    );
}
