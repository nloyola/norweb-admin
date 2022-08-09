import { Project } from '@app/models/projects';
import { nlToFragments } from '@app/utils/nltoFragments';
import { Box, Chip } from '@mui/material';
import { countryCodes, countryCodeToCountry, Status, statusToLabel } from '@app/models';
import { PropertiesSchema } from '@app/components/PropertiesGrid/PropertiesGrid';
import { datesRangeToString } from '@app/utils/utils';

function keywordToArray(keywords: string): string[] {
  if (!keywords || keywords === '') {
    return [];
  }
  return keywords.split(/[ ,]/);
}

export function projectPropertySchema(project: Project): PropertiesSchema {
  const startDate = new Date(project.startDate);
  const endDate = project.endDate ? new Date(project.endDate) : undefined;

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
    duratrion: {
      propName: 'duration',
      label: 'Duration',
      value: datesRangeToString(startDate, endDate),
      propertyChanger: 'dateRange',
      changerPropsExtra: {
        value: { startDate, endDate }
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
        <>
          <Box>
            {keywordToArray(project?.keywords).map((kw) => (
              <Chip key={kw} label={kw} color="primary" />
            ))}
          </Box>
        </>
      ),
      propertyChanger: 'text',
      changerPropsExtra: {
        value: project?.keywords,
        multiline: true
      }
    },
    country: {
      propName: 'countryCode',
      label: 'Country',
      value: project?.countryCode ? countryCodeToCountry(project.countryCode) : 'Not Avaialable',
      propertyChanger: 'autocomplete',
      changerPropsExtra: {
        label: 'Country',
        value: project?.countryCode,
        options: countryCodes.map((country) => ({ id: country.code, label: country.name }))
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
