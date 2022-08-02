import { Fragment } from 'react';
import { Project } from '@app/models/projects';
import { nlToFragments } from '@app/utils/nltoFragments';
import { Box, Chip } from '@mui/material';
import { countryCodes, Status, statusToLabel } from '@app/models';
import { PropertiesSchema } from '@app/components/PropertiesGrid/PropertiesGrid';

function keywordToArray(keywords: string): string[] {
    if (!keywords || keywords === '') {
        return [];
    }
    return keywords.split(/[ ,]/);
}

export function projectPropertySchema(project: Project): PropertiesSchema {
    let countryName: string;

    if (project?.countryCode) {
        const countryCode = countryCodes.find((code) => code.code === project.countryCode);
        if (countryCode) {
            countryName = countryCode.name;
        }
    }

    const result: PropertiesSchema = {
        name: {
            propName: 'name',
            label: 'Project Name',
            value: project?.name ?? 'Not available',
            propertyChanger: 'text',
            changerPropsExtra: {
                value: project?.name
            }
        },
        shorthand: {
            propName: 'shorthand',
            label: 'Short name',
            value: project?.shorthand ?? 'Not available',
            propertyChanger: 'text',
            changerPropsExtra: {
                value: project?.shorthand
            }
        },
        description: {
            propName: 'description',
            label: 'Description',
            value: nlToFragments(project?.description),
            propertyChanger: 'text',
            changerPropsExtra: {
                value: project?.description,
                multiline: true
            }
        },
        startDate: {
            propName: 'startDate',
            label: 'Start Date',
            value: project?.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not available',
            propertyChanger: 'date',
            changerPropsExtra: {
                value: project?.startDate ? new Date(project.startDate).toLocaleDateString() : null,
                maxDate: project?.endDate
            }
        },
        endDate: {
            propName: 'endDate',
            label: 'End Date',
            value: project?.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not available',
            propertyChanger: 'date',
            changerPropsExtra: {
                value: project?.endDate ? new Date(project.endDate).toLocaleDateString() : null,
                minDate: project?.startDate
            }
        },
        goals: {
            propName: 'goals',
            label: 'Goals',
            value: nlToFragments(project?.goals),
            propertyChanger: 'text',
            changerPropsExtra: {
                value: project?.goals,
                multiline: true
            }
        },
        vision: {
            propName: 'vision',
            label: 'Vision',
            value: nlToFragments(project?.vision),
            propertyChanger: 'text',
            changerPropsExtra: {
                value: project?.vision,
                multiline: true
            }
        },
        keywords: {
            propName: 'keywords',
            label: 'Keywords',
            value: (
                <Fragment>
                    <Box>
                        {keywordToArray(project?.keywords).map((kw) => (
                            <Chip key={kw} label={kw} color="primary" />
                        ))}
                    </Box>
                </Fragment>
            ),
            propertyChanger: 'text',
            changerPropsExtra: {
                value: project?.keywords,
                multiline: true
            }
        },
        country: {
            propName: 'country',
            label: 'Country',
            value: countryName ?? 'Not available',
            propertyChanger: 'autocomplete',
            changerPropsExtra: {
                label: 'Country',
                value: countryName,
                options: countryCodes.map((country) => ({ id: country.name, label: country.name }))
            }
        },
        status: {
            propName: 'status',
            label: 'Status',
            value: project?.status ? statusToLabel(project?.status) : 'Not available',
            propertyChanger: 'radio',
            changerPropsExtra: {
                value: project?.status,
                options: Object.values(Status).map((value) => ({ id: value, label: statusToLabel(value) }))
            }
        }
    };

    return result;
}
