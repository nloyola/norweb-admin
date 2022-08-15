import { usePerson } from '@app/hooks/usePerson';
import { personName } from '@app/models/people';
import { ArrowBack } from '@mui/icons-material';
import { Alert, CircularProgress, Fab, Grid, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityProperty } from '../EntityProperty';
import { PropertyChanger } from '../PropertyChanger/PropertyChanger';
import { ShowError } from '../ShowError';
import { personPropertiesSchema } from './PersonPropertiesSchema';

// FIXME: Brief CV and CV fields have pencil icon on same row

export function PersonBio() {
  const navigate = useNavigate();
  const params = useParams();
  const personId = Number(params.personId);

  const [open, setOpen] = useState(false);
  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null);

  const { error, isError, isLoading, data: person } = usePerson(personId);

  const onPropChange = (propertyName: string) => {
    setPropertyToUpdate(propertyName);
    setOpen(true);
  };

  const handleClose = <T extends unknown>(propertyName: string, newValue?: T) => {
    setOpen(false);
    if (!newValue) {
      return;
    }

    if (!person) {
      throw new Error('setPerson is invalid');
    }

    const newValues: any = { ...person };
    newValues[propertyName] = newValue;

    // FIXME: uncomment this when the backend can update a person
    // const modifiedPerson = await PersonsService.update(newValues);
    // updatePerson(modifiedPerson);
  };

  const backClicked = () => {
    navigate('../../');
  };

  if (isError) {
    return <ShowError error={error} />;
  }

  if (isLoading || !person) {
    return <CircularProgress />;
  }

  const schemas = personPropertiesSchema(person);

  return (
    <>
      <Stack mb={10}>
        <Alert severity="warning">Does not save changes to the database yet!</Alert>
      </Stack>
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
