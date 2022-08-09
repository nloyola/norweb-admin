import { useState } from 'react';
import { personName } from '@app/models/people';
import { Alert, CircularProgress, Fab, Grid, Stack } from '@mui/material';
import { PropertyChanger } from '../PropertyChanger/PropertyChanger';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { Box } from '@mui/system';
import { PersonContextType } from '@app/pages/people/PersonPage';
import { personPropertiesSchema } from './PersonPropertiesSchema';
import { EntityProperty } from '../EntityProperty';

export function PersonBio() {
  const navigate = useNavigate();
  const { person, updatePerson }: PersonContextType = useOutletContext();
  const [open, setOpen] = useState(false);
  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null);

  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const onPropChange = (propertyName: string) => {
    setPropertyToUpdate(propertyName);
    setOpen(true);
  };

  const handleClose = <T extends unknown>(propertyName: string, newValue?: T) => {
    const saveData = async () => {
      if (!newValue) {
        return;
      }

      try {
        if (!person) {
          throw new Error('setPerson is invalid');
        }

        const newValues: any = { ...person };
        newValues[propertyName] = newValue;

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

  const backClicked = () => {
    navigate(-1);
  };

  if (saving) {
    return <CircularProgress />;
  }

  if (saveError !== '') {
    return <Alert severity="error">{saveError}</Alert>;
  }

  const schemas = personPropertiesSchema(person);

  return (
    <>
      <Box
        sx={{
          pl: 2
        }}
      >
        <Grid container spacing={4}>
          <EntityProperty propName="name" label="Name" value={personName(person)} handleChange={onPropChange} />
          <EntityProperty propName="gender" label="Gender" value={person.gender} handleChange={onPropChange} />
          <EntityProperty
            propName="email"
            label="Email"
            value={
              person.email && person.email !== '' ? <a href={`mailto:${person.email}`}>{person.email}</a> : undefined
            }
            handleChange={onPropChange}
          />
          <EntityProperty
            propName="website"
            label="Website"
            value={person.website && person.website !== '' ? <a href={person.website}>{person.website}</a> : undefined}
            handleChange={onPropChange}
          />
          <EntityProperty
            propName="phone"
            label="Telephone"
            value={
              person.phone && person.phone !== '' ? <a href={`tel://${person.phone}`}>{person.phone}</a> : undefined
            }
            handleChange={onPropChange}
          />
          <EntityProperty
            propName="cvBrief"
            label="Brief CV"
            value={person?.cvBrief ? <div dangerouslySetInnerHTML={{ __html: person.cvBrief }} /> : undefined}
            handleChange={onPropChange}
          />
          <EntityProperty
            propName="cvText"
            label="CV"
            value={person?.cvText ? <div dangerouslySetInnerHTML={{ __html: person.cvText }} /> : undefined}
            handleChange={onPropChange}
          />
        </Grid>
      </Box>
      <Stack spacing={2} direction="row" mt={5}>
        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
          <ArrowBack sx={{ mr: 1 }} />
          Back
        </Fab>
      </Stack>
      {open && propertyToUpdate && schemas[propertyToUpdate].propertyType && (
        <PropertyChanger
          title={'Person: change settings'}
          {...schemas[propertyToUpdate]}
          open={open}
          onClose={handleClose}
        />
      )}
    </>
  );
}
