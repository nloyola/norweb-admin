import { PropertyChanger } from '@app/components/PropertyChanger/PropertyChanger';
import { useFunder } from '@app/hooks/useFunder';
import { CountryNames, statusToLabel } from '@app/models';
import { Funder, funderTypeToLabel } from '@app/models/funders';
import { FundersService } from '@app/services/funders/FundersService';
import { ArrowBack } from '@mui/icons-material';
import { CircularProgress, Fab, Grid, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityProperty } from '../EntityProperty';
import { ShowError } from '../ShowError';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';
import { funderPropertiesSchemas } from './funderPropertiesSchemas';

/**
 * A component that shows a funder's settings and allows the user to modify them.
 */
export function FunderDetails() {
  const params = useParams();
  const funderId = Number(params.funderId);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null);
  const { error, isError, isLoading, isFetching, data: funder } = useFunder(funderId);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const updateFunder = useMutation((funder: Funder) => FundersService.update(funder), {
    onSuccess: (newFunder: Funder) => {
      queryClient.setQueryData(['funders', funderId], newFunder);
      queryClient.invalidateQueries(['funders']);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The funder was updated');
    }
  });

  const onPropChange = (propertyName: string) => {
    setPropertyToUpdate(propertyName);
    setOpen(true);
  };

  const handleClose = <T extends unknown>(propertyName: string, newValue?: T) => {
    setOpen(false);
    if (!newValue) {
      return;
    }

    if (!funder) {
      throw new Error('funder is invalid');
    }

    const newValues = { ...funder };

    // see https://bobbyhadz.com/blog/typescript-create-type-from-object-keys
    newValues[propertyName as keyof Funder] = newValue as keyof Funder[keyof Funder];

    updateFunder.mutate(newValues);
  };

  const backClicked = () => {
    navigate(-1);
  };

  if (isError) {
    return <ShowError error={error} />;
  }

  if (updateFunder.isError) {
    return <ShowError error={updateFunder.error} />;
  }

  if (isLoading || !funder) {
    return <CircularProgress />;
  }

  const Website = funder.web ? (
    <a href={funder.web} target="_blank">
      {funder.web}
    </a>
  ) : null;

  const schemas = funderPropertiesSchemas(funder);

  return (
    <>
      <Grid container spacing={4}>
        <EntityProperty propName="name" label="Funder Name" value={funder.name} handleChange={onPropChange} />
        <EntityProperty propName="acronym" label="Acronym" value={funder.acronym} handleChange={onPropChange} />
        <EntityProperty
          propName="countryCode"
          label="Country"
          value={funder.countryCode ? CountryNames[funder.countryCode] : null}
          handleChange={onPropChange}
        />
        <EntityProperty propName="web" label="Website" value={Website} handleChange={onPropChange} />
        <EntityProperty
          propName="type"
          label="Funder type"
          value={funder.type ? funderTypeToLabel(funder.type) : undefined}
          handleChange={onPropChange}
        />
        <EntityProperty
          propName="status"
          label="Status"
          value={funder.status ? statusToLabel(funder.status) : undefined}
          handleChange={onPropChange}
        />
      </Grid>

      <Stack spacing={2} direction="row" mt={5}>
        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
          <ArrowBack sx={{ mr: 1 }} />
          Back
        </Fab>
      </Stack>
      {open && propertyToUpdate && schemas[propertyToUpdate].propertyType && (
        <PropertyChanger
          title={'Funder: change settings'}
          {...schemas[propertyToUpdate]}
          open={open}
          onClose={handleClose}
        />
      )}
    </>
  );
}
