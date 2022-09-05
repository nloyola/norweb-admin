import { ProjectsApi } from '@app/api/ProjectsApi';
import {
  ProjectResearchArea,
  ProjectResearchAreaAdd,
  ProjectResearchAreaUpdate
} from '@app/models/projects/ProjectResearchArea';
import { Button, Chip, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';
import { ProjectResearchAreaDeleteDialog } from './ProjectResearchAreaDeleteDialog';
import { ProjectResearchAreaDialog, ProjectResearchAreaFormInput } from './ProjectResearchAreaDialog';

/**
 * A component that allows the user to add, update and delete the project's key 'research area.
 */
export const KeyResearchArea: React.FC = () => {
  const params = useParams();
  const projectId = Number(params.projectId);

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    error,
    isError,
    isLoading,
    data: keyArea
  } = useQuery(
    ['project', projectId, 'keyResearchArea'],
    () => ProjectsApi.get(projectId).then((project) => project.researchAreas.find((ra) => ra.isKeyArea)),
    {
      keepPreviousData: true
    }
  );

  const addResearchArea = useMutation((area: ProjectResearchAreaAdd) => ProjectsApi.addResearchArea(projectId, area), {
    onSuccess: (ra: ProjectResearchArea) => {
      queryClient.setQueryData(['projects', projectId, 'keyResearchArea'], ra);
      queryClient.invalidateQueries(['project', projectId]);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The key research area was added');
    }
  });

  const updateResearchArea = useMutation(
    (area: ProjectResearchAreaUpdate) => ProjectsApi.updateResearchArea(projectId, area),
    {
      onSuccess: (ra: ProjectResearchArea) => {
        queryClient.setQueryData(['projects', projectId, 'keyResearchArea'], ra);
        queryClient.invalidateQueries(['project', projectId]);
        enqueueEntitySavedSnackbar(enqueueSnackbar, 'The key research area was updated');
      }
    }
  );

  const deleteResearchArea = useMutation((areaId: number) => ProjectsApi.deleteResearchArea(projectId, areaId), {
    onSuccess: () => {
      queryClient.setQueryData(['projects', projectId, 'keyResearchArea'], undefined);
      queryClient.invalidateQueries(['project', projectId]);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The key research area was deleted');
    }
  });

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleAddClosed = (newArea?: ProjectResearchAreaFormInput) => {
    setOpenAdd(false);
    if (!newArea) {
      return;
    }
    if (!newArea?.areaId) {
      throw new Error('area id is invalid');
    }
    addResearchArea.mutate({
      projectId,
      researchAreaId: newArea.areaId,
      isKeyArea: true
    });
  };

  const handleUpdateClosed = (updatedArea?: ProjectResearchAreaFormInput) => {
    setOpenUpdate(false);
    if (!updatedArea) {
      return;
    }
    if (!keyArea?.id) {
      throw new Error('area id is invalid');
    }
    if (!updatedArea?.areaId) {
      throw new Error('area id is invalid');
    }
    updateResearchArea.mutate({
      id: keyArea?.id,
      projectId,
      researchAreaId: updatedArea.areaId,
      isKeyArea: true
    });
  };

  const handleDeleteOk = () => {
    setOpenDelete(false);
    if (!keyArea?.id) {
      throw new Error('area id is invalid');
    }
    deleteResearchArea.mutate(keyArea.id);
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleClicked = () => {
    setOpenUpdate(true);
  };

  const handleDelete = () => {
    setOpenDelete(true);
  };

  const isErrorAggregated =
    isError || addResearchArea.isError || updateResearchArea.isError || deleteResearchArea.isError;
  let errorAggregated: unknown = null;

  if (isError) {
    errorAggregated = error;
  }

  if (addResearchArea.isError) {
    errorAggregated = addResearchArea.error;
  }

  if (updateResearchArea.isError) {
    errorAggregated = updateResearchArea.error;
  }

  if (deleteResearchArea.isError) {
    errorAggregated = deleteResearchArea.error;
  }

  if (isErrorAggregated) {
    enqueueEntitySavedSnackbar(enqueueSnackbar, `researchArea backend error: ${errorAggregated}`);
  }

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
        <Grid item xs>
          {!!keyArea && (
            <Box>
              <Chip
                label={keyArea?.researchArea?.name}
                color="primary"
                sx={{ margin: '0.2rem' }}
                onClick={handleClicked}
                onDelete={handleDelete}
              />
            </Box>
          )}
        </Grid>
      </Grid>
      {!keyArea && (
        <Grid item>
          <Button size="small" variant="outlined" onClick={handleAdd} disabled={false}>
            Add
          </Button>
        </Grid>
      )}
      {openAdd && (
        <ProjectResearchAreaDialog
          title="Add key research area"
          area={keyArea}
          open={openAdd}
          onClose={handleAddClosed}
        />
      )}
      {openUpdate && (
        <ProjectResearchAreaDialog
          title="Update key research area"
          area={keyArea}
          open={openUpdate}
          onClose={handleUpdateClosed}
        />
      )}
      {openDelete && (
        <ProjectResearchAreaDeleteDialog
          area={keyArea}
          open={openDelete}
          onOk={handleDeleteOk}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
};
