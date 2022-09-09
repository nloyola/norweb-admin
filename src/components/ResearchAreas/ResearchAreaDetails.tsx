import { PropertiesSchema, PropertyChanger, PropertyTypes } from '@app/components/PropertyChanger/PropertyChanger';
import { CountryNames, Status, statusToLabel } from '@app/models';
import { ResearchAreasApi } from '@app/api/ResearchAreasApi';
import { ArrowBack } from '@mui/icons-material';
import { Box, CircularProgress, Fab, Grid, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityProperty } from '../EntityProperty';
import { ShowError } from '../ShowError';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { ResearchArea } from '@app/models/projects/ResearchArea';
import { ResearchAreaDeleteDialog } from './ResearchAreaDeleteDialog';
import { ApiError } from '@app/api/api';
import { ResearchAreaInUseDialog } from './ResearchAreaInUseDialog';

/**
 * A component that shows a researchArea's settings and allows the user to modify them.
 */
export function ResearchAreaDetails() {
  const params = useParams();
  const areaId = Number(params.areaId);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openInUse, setOpenInUse] = useState(false);

  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null);
  const {
    error,
    isError,
    isLoading,
    data: area
  } = useQuery(['research-areas', areaId], async () => ResearchAreasApi.get(areaId));

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const updateResearchArea = useMutation((researchArea: ResearchArea) => ResearchAreasApi.update(researchArea), {
    onSuccess: (newArea: ResearchArea) => {
      queryClient.setQueryData(['research-areas', areaId], newArea);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The research area was updated');
    }
  });

  const deleteResearchArea = useMutation((researchAreaId: number) => ResearchAreasApi.delete(researchAreaId), {
    onSuccess: () => {
      queryClient.removeQueries(['research-areas', areaId]);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The research area was deleted');
      navigate('../../');
    },
    onError: async (err: ApiError) => {
      if (err.error?.research_area === 'in use') {
        setOpenInUse(true);
        return;
      }
      console.error(err);
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

    if (!area) {
      throw new Error('researchArea is invalid');
    }

    const newValues = { ...area };

    // see https://bobbyhadz.com/blog/typescript-create-type-from-object-keys
    newValues[propertyName as keyof ResearchArea] = newValue as keyof ResearchArea[keyof ResearchArea];

    updateResearchArea.mutate(newValues);
  };

  const deleteClicked = () => {
    setOpenDelete(true);
  };

  const handleDeleteOk = () => {
    setOpenDelete(false);
    if (!area) {
      throw new Error('researchArea is invalid');
    }
    deleteResearchArea.mutate(area.id);
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleInUseOk = () => {
    setOpenInUse(false);
  };

  const backClicked = () => {
    navigate(-1);
  };

  if (isError) {
    console.log(error);
    return <ShowError error={error} />;
  }

  if (updateResearchArea.isError) {
    return <ShowError error={updateResearchArea.error} />;
  }

  if (isLoading || !area) {
    return <CircularProgress />;
  }

  const schemas: PropertiesSchema = {
    name: {
      propertyName: 'name',
      propertyType: PropertyTypes.TEXT,
      label: 'Research area name',
      value: area.name
    },
    status: {
      propertyName: 'status',
      propertyType: PropertyTypes.RADIO,
      label: 'Status',
      value: area.status,
      propertyOptions: Object.values(Status).map((value) => ({ id: value, label: statusToLabel(value) }))
    }
  };

  return (
    <>
      <Grid container spacing={5}>
        <EntityProperty propName="name" label="Area Name" value={area.name} handleChange={onPropChange} />
        <EntityProperty
          propName="status"
          label="Status"
          value={area.status ? statusToLabel(area.status) : undefined}
          handleChange={onPropChange}
        />
      </Grid>

      <Box
        sx={{
          pt: 5,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        {' '}
        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
          <ArrowBack sx={{ mr: 1 }} />
          Back
        </Fab>
        <Fab color="warning" size="small" aria-label="add" variant="extended" onClick={deleteClicked}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </Fab>
      </Box>
      {open && propertyToUpdate && schemas[propertyToUpdate].propertyType && (
        <PropertyChanger
          title={'ResearchArea: change settings'}
          {...schemas[propertyToUpdate]}
          open={open}
          onClose={handleClose}
        />
      )}
      {openDelete && (
        <ResearchAreaDeleteDialog area={area} open={openDelete} onOk={handleDeleteOk} onCancel={handleDeleteCancel} />
      )}
      {openInUse && <ResearchAreaInUseDialog area={area} open={openInUse} onOk={handleInUseOk} />}
    </>
  );
}
