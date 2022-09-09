import { ProjectsApi } from '@app/api/ProjectsApi';
import { ProjectResearchAreaAdd, ProjectResearchAreaUpdate } from '@app/models/projects/ProjectResearchArea';
import { Button, Chip, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';
import { ProjectResearchAreaDeleteDialog } from './ProjectResearchAreaDeleteDialog';
import { ProjectResearchAreaDialog, ProjectResearchAreaFormInput } from './ProjectResearchAreaDialog';

type ResearchAreasProps = {
  disabled?: boolean;
};

/**
 * A component that allows the user to add, update and delete researchAreas from a Project.
 */
export function ProjectResearchAreas({ disabled }: ResearchAreasProps) {
  const params = useParams();
  const projectId = Number(params.projectId);

  const [selected, setSelected] = useState<ProjectResearchAreaUpdate | undefined>(undefined);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    error,
    isError,
    data: areas
  } = useQuery(
    ['project', projectId, 'research-areas'],
    () => ProjectsApi.get(projectId).then((project) => project.researchAreas.filter((ra) => !ra.isKeyArea)),
    {
      keepPreviousData: true
    }
  );

  const addResearchArea = useMutation((area: ProjectResearchAreaAdd) => ProjectsApi.addResearchArea(projectId, area), {
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId, 'research-areas']);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The research area was added');
    }
  });

  const updateResearchArea = useMutation(
    (researchArea: ProjectResearchAreaUpdate) => ProjectsApi.updateResearchArea(projectId, researchArea),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project', projectId, 'research-areas']);
        enqueueEntitySavedSnackbar(enqueueSnackbar, 'The research area was updated');
      }
    }
  );

  const deleteResearchArea = useMutation(
    (researchAreaId: number) => ProjectsApi.deleteResearchArea(projectId, researchAreaId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project', projectId, 'researchAreas']);
        enqueueEntitySavedSnackbar(enqueueSnackbar, 'The research area was deleted');
      }
    }
  );

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleAddClosed = (newArea?: ProjectResearchAreaFormInput) => {
    setOpenAdd(false);
    if (!newArea) {
      return;
    }

    addResearchArea.mutate({
      projectId,
      researchAreaId: newArea.areaId,
      isKeyArea: false
    });
  };

  const handleUpdateClosed = (updatedArea?: ProjectResearchAreaFormInput) => {
    setOpenUpdate(false);
    if (!updatedArea) {
      return;
    }
    if (!selected) {
      throw new Error('selected is invalid');
    }
    updateResearchArea.mutate({
      ...selected,
      researchAreaId: updatedArea.areaId,
      isKeyArea: false
    });
  };

  const handleDeleteOk = () => {
    setOpenDelete(false);
    if (!selected) {
      return;
    }

    deleteResearchArea.mutate(selected.id);
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
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
          <Box>
            {(areas || []).map((area, index) => {
              const handleClicked = () => {
                setSelected(area);
                setOpenUpdate(true);
              };

              const handleDelete = () => {
                setSelected(area);
                setOpenDelete(true);
              };

              return (
                <Chip
                  key={`${area?.researchArea?.name}-${index}`}
                  label={area?.researchArea?.name}
                  color="primary"
                  sx={{ margin: '0.2rem' }}
                  onClick={handleClicked}
                  onDelete={handleDelete}
                />
              );
            })}
          </Box>
        </Grid>
      </Grid>
      <Grid item>
        <Button size="small" variant="outlined" onClick={handleAdd} disabled={disabled}>
          Add
        </Button>
      </Grid>
      {openAdd && !disabled && (
        <ProjectResearchAreaDialog
          title="Add research area"
          area={undefined}
          open={openAdd}
          onClose={handleAddClosed}
        />
      )}
      {openUpdate && !disabled && (
        <ProjectResearchAreaDialog
          title="Update research area"
          area={selected}
          open={openUpdate}
          onClose={handleUpdateClosed}
        />
      )}
      {openDelete && !disabled && selected && (
        <ProjectResearchAreaDeleteDialog
          area={selected}
          open={openDelete}
          onOk={handleDeleteOk}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}
