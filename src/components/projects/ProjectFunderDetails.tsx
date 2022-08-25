import { FundersApi } from '@app/api/FundersApi';
import { ProjectsApi } from '@app/api/ProjectsApi';
import { ProjectFunder, ProjectFunderUpdate } from '@app/models/projects/ProjectFunder';
import { datesRangeToString } from '@app/utils/utils';
import { ArrowBack } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, CircularProgress, Fab, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityProperty } from '../EntityProperty';
import { DateRange, PropertyChanger } from '../PropertyChanger';
import { ShowError } from '../ShowError';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';
import { ProjectFunderDeleteDialog } from './ProjectFunderDeleteDialog';
import { projectFunderPropertiesSchemas } from './projectFunderPropertiesSchema';

export function ProjectFunderDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = Number(params.projectId);
  const projectFunderId = Number(params.funderId);

  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const {
    error,
    isError,
    isLoading,
    data: projectFunder
  } = useQuery(
    ['projects', projectId, 'funders', projectFunderId],
    async () => ProjectsApi.getFunder(projectId, projectFunderId),
    {
      keepPreviousData: true
    }
  );

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const updateProjectFunder = useMutation(
    (projectFunder: ProjectFunderUpdate) => ProjectsApi.updateFunder(projectId, projectFunder),
    {
      onSuccess: (updatedPF) => {
        queryClient.setQueryData(['projects', projectId, 'funders', projectFunderId], updatedPF);
      }
    }
  );

  const deleteProjectFunder = useMutation(
    (projectFunderId: number) => ProjectsApi.deleteFunder(projectId, projectFunderId),
    {
      onSuccess: () => {
        queryClient.removeQueries(['projects', projectId, 'projectFunders', projectFunderId]);
        enqueueEntitySavedSnackbar(enqueueSnackbar, 'The projectFunder was deleted');
        navigate('../');
      }
    }
  );

  const onPropChange = (propertyName: string) => {
    setPropertyToUpdate(propertyName);
    setOpen(true);
  };

  const handleClose = <T extends unknown>(propertyName: string, newValue?: T) => {
    setOpen(false);
    if (!newValue) {
      return;
    }

    if (!projectFunder) {
      throw new Error('projectFunder is invalid');
    }

    const newValues = { ...projectFunder };
    if (propertyName === 'duration') {
      const newDates = newValue as DateRange;
      newValues.startDate = newDates.startDate;
      newValues.endDate = newDates.endDate;
    } else {
      // see https://bobbyhadz.com/blog/typescript-create-type-from-object-keys
      newValues[propertyName as keyof ProjectFunder] = newValue as keyof ProjectFunder[keyof ProjectFunder];
    }

    updateProjectFunder.mutate(newValues);
  };

  const deleteClicked = () => {
    setOpenDelete(true);
  };

  const handleDeleteOk = () => {
    setOpenDelete(false);
    if (!projectFunder) {
      throw new Error('projectFunder is invalid');
    }
    deleteProjectFunder.mutate(projectFunder.id);
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const backClicked = () => {
    navigate(-1);
  };

  if (isError) {
    return <ShowError error={error} />;
  }

  if (updateProjectFunder.isError) {
    return <ShowError error={updateProjectFunder.error} />;
  }

  if (deleteProjectFunder.isError) {
    return <ShowError error={deleteProjectFunder.error} />;
  }

  if (isLoading || !projectFunder || deleteProjectFunder.isLoading) {
    return <CircularProgress />;
  }
  1;

  const schemas = projectFunderPropertiesSchemas(projectFunder);

  const funderName = projectFunder.funder ? `${projectFunder.funder.name} (${projectFunder.funder.acronym})` : null;

  return (
    <>
      <Grid container spacing={4}>
        <EntityProperty propName="title" label="Funder title" value={projectFunder.title} handleChange={onPropChange} />
        <EntityProperty propName="funderId" label="Funder name" value={funderName} handleChange={onPropChange} />
        <EntityProperty propName="grantId" label="Grant ID" value={projectFunder.grantId} handleChange={onPropChange} />
        <EntityProperty
          propName="grantType"
          label="Grant type"
          value={projectFunder.grantType}
          handleChange={onPropChange}
        />
        <EntityProperty propName="amount" label="Amount" value={projectFunder.amount} handleChange={onPropChange} />
        <EntityProperty
          propName="duration"
          label="Duration"
          value={datesRangeToString(projectFunder.startDate, projectFunder.endDate)}
          handleChange={onPropChange}
        />
        <EntityProperty propName="usage" label="Usage" value={projectFunder.usage} handleChange={onPropChange} />
        <EntityProperty propName="comment" label="Comment" value={projectFunder.comment} handleChange={onPropChange} />
      </Grid>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
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
          title={'Project funder: change settings'}
          {...schemas[propertyToUpdate]}
          open={open}
          onClose={handleClose}
        />
      )}
      {openDelete && (
        <ProjectFunderDeleteDialog
          funder={projectFunder}
          open={openDelete}
          onOk={handleDeleteOk}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}
