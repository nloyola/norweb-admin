import { FC, createElement, useState } from 'react';
import { Person, personName, personTitles } from '@app/models/people';
import { Alert, Avatar, CircularProgress, Fab, Grid, Paper, Stack, Typography } from '@mui/material';
import { PropertiesGrid, PropertiesSchema, PropertyChangers, PropertyInfo } from '../PropertiesGrid/PropertiesGrid';
import { PropertyChangerProps } from '../PropertyChanger/PropertyChanger';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { Box } from '@mui/system';

function personDetails(person: Person): PropertiesSchema {
  const result: PropertiesSchema = {
    name: {
      propName: 'name',
      label: 'Name',
      value: personName(person),
      propertyChanger: 'text',
      changerPropsExtra: {
        // FIXME
        //value: { givenNames: person.givenNames, legalNames: person.legalNames }
        value: person.givenNames
      }
    },
    gender: {
      propName: 'gender',
      label: 'Gender',
      value: person.gender ?? 'Not available',
      propertyChanger: 'radio',
      changerPropsExtra: {
        value: person?.gender,
        options: [
          { id: 'F', label: 'Female' },
          { id: 'M', label: 'Male' },
          { id: 'O', label: 'Other' }
        ]
      }
    },
    email: {
      propName: 'email',
      label: 'Email',
      value:
        person.email && person.email !== '' ? <a href={`mailto:${person.email}`}>{person.email}</a> : 'NotAvailable',
      propertyChanger: 'text',
      changerPropsExtra: {
        value: person?.email
      }
    },
    website: {
      propName: 'website',
      label: 'Website',
      value:
        person.website && person.website !== '' ? (
          <a href={person.website} target="_blank">
            {person.website}
          </a>
        ) : (
          'Not available'
        ),
      propertyChanger: 'text',
      changerPropsExtra: {
        value: person?.website
      }
    },
    telephone: {
      propName: 'telephone',
      label: 'Telephone',
      value:
        person.phone && person.phone !== '' ? <a href={`tel://${person.phone}`}>{person.phone}</a> : 'Not available',
      propertyChanger: 'text',
      changerPropsExtra: {
        value: person?.phone
      }
    },
    cvBrief: {
      propName: 'cvBrief',
      label: 'Brief CV',
      value: person?.cvBrief ? <div dangerouslySetInnerHTML={{ __html: person.cvBrief }} /> : 'Not available',
      propertyChanger: 'text',
      changerPropsExtra: {
        value: person?.cvBrief,
        multiline: true
      }
    },
    cvText: {
      propName: 'cvText',
      label: 'CV',
      value: person?.cvText ? <div dangerouslySetInnerHTML={{ __html: person.cvText }} /> : 'Not available',
      propertyChanger: 'text',
      changerPropsExtra: {
        value: person?.cvText,
        multiline: true
      }
    }
  };

  return result;
}

type PersonBioProps = {
  person: Person;
};

export function PersonBio({ person }: PersonBioProps) {
  const navigate = useNavigate();
  const [updatedPerson, setUpdatedPerson] = useState<Person | null>(null);
  const [open, setOpen] = useState(false);
  const [propInfo, setPropInfo] = useState<PropertyInfo<unknown>>({ propName: '', label: '' });
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const onPropChange = (propInfo: PropertyInfo<unknown>) => {
    setPropInfo(propInfo);
    setOpen(true);
  };

  const handleClose = <T extends unknown>(newValue?: T) => {
    const saveData = async () => {
      if (!newValue) {
        return;
      }

      try {
        if (!person) {
          throw new Error('setPerson is invalid');
        }

        const newValues: any = { ...person };
        newValues[propInfo.propName] = newValue;

        // FIXME: uncomment this when the backend can update a person
        // const modifiedPerson = await PersonsService.update(newValues);
        // updatePerson(modifiedPerson);
      } catch (err) {
        console.error(err);
        setSaveError(err instanceof Error ? err.message : JSON.stringify(err));
      } finally {
        setSaving(false);
      }
    };

    setOpen(false);
    saveData();
  };

  const propertyToElement = (propInfo: PropertyInfo<unknown>) => {
    if (!propInfo.propertyChanger) {
      throw Error('property changer is undefined');
    }

    if (PropertyChangers[propInfo.propertyChanger] === undefined) {
      throw Error(`property changer is invalid: ${propInfo.propertyChanger}`);
    }

    const props: PropertyChangerProps<unknown> = {
      title: 'Change Person Settings',
      id: propInfo.propName,
      label: propInfo.label,
      open: open,
      onClose: handleClose,
      ...propInfo.changerPropsExtra
    };

    return createElement<PropertyChangerProps<unknown>>(PropertyChangers[propInfo.propertyChanger] as FC, props);
  };

  const backClicked = () => {
    navigate(-1);
  };

  if (saving) {
    return <CircularProgress />;
  }

  if (saveError !== '') {
    return <Alert severity="error">{saveError}</Alert>;
  }

  const schema = personDetails(person);

  return (
    <Stack spacing={2}>
      <Paper
        sx={{
          p: 3
        }}
      >
        <Stack spacing={2} mb={10} direction="row">
          <Avatar variant="rounded" src={person.photo} sx={{ width: 200, height: 200 }} />
          <Stack spacing={2}>
            <Typography component="h1" variant="h3">
              {personName(person)}
            </Typography>
            <Typography component="h2" variant="h6">
              {personTitles(person)}
            </Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            pl: 2
          }}
        >
          <PropertiesGrid schema={schema} handleChange={onPropChange} />
        </Box>
        <Stack spacing={2} direction="row" mt={5}>
          <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
            <ArrowBack sx={{ mr: 1 }} />
            Back
          </Fab>
        </Stack>
      </Paper>
      {open && propertyToElement(propInfo)}
    </Stack>
  );
}
