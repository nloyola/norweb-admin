import { ProjectsApi } from '@app/api/ProjectsApi';
import { ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { Button, Chip, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';
import { KeywordDialog, KeywordFormInput } from './KeywordDialog';
import { ProjectKeywordDeleteDialog } from './ProjectKeywordDeleteDialog';

type KeywordsProps = {
  disabled?: boolean;
};

/**
 * A component that allows the user to add, update and delete keywords from a Project.
 */
export function Keywords({ disabled }: KeywordsProps) {
  const params = useParams();
  const projectId = Number(params.projectId);

  const [selected, setSelected] = useState<ProjectKeywordUpdate | undefined>(undefined);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const {
    error,
    isError,
    isLoading,
    data: keywords
  } = useQuery(
    ['project', projectId, 'keywords'],
    () => ProjectsApi.get(projectId).then((project) => project.keywords),
    {
      keepPreviousData: true
    }
  );

  const addKeyword = useMutation((keyword: KeywordFormInput) => ProjectsApi.addKeyword(projectId, keyword), {
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The keyword was addd');
    }
  });

  const updateKeyword = useMutation((keyword: ProjectKeywordUpdate) => ProjectsApi.updateKeyword(projectId, keyword), {
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The keyword was updated');
    }
  });

  const deleteKeyword = useMutation((keywordId: number) => ProjectsApi.deleteKeyword(projectId, keywordId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The keyword was deleted');
    }
  });

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleAddClosed = (newKeyword?: KeywordFormInput) => {
    setOpenAdd(false);
    if (!newKeyword) {
      return;
    }
    addKeyword.mutate(newKeyword);
  };

  const handleUpdateClosed = (updatedKeyword?: KeywordFormInput) => {
    setOpenUpdate(false);
    if (!updatedKeyword) {
      return;
    }
    if (!selected) {
      throw new Error('selected is invalid');
    }
    updateKeyword.mutate({ ...selected, ...updatedKeyword });
  };

  const handleDeleteOk = () => {
    setOpenDelete(false);
    if (!selected) {
      return;
    }

    deleteKeyword.mutate(selected.id);
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const isErrorAggregated = isError || addKeyword.isError || updateKeyword.isError || deleteKeyword.isError;
  let errorAggregated: unknown = null;

  if (isError) {
    errorAggregated = error;
  }

  if (addKeyword.isError) {
    errorAggregated = addKeyword.error;
  }

  if (updateKeyword.isError) {
    errorAggregated = updateKeyword.error;
  }

  if (deleteKeyword.isError) {
    errorAggregated = deleteKeyword.error;
  }

  if (isErrorAggregated) {
    enqueueEntitySavedSnackbar(enqueueSnackbar, `keyword backend error: ${errorAggregated}`);
  }

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
        <Grid item xs>
          <Box>
            {(keywords || []).map((kw, index) => {
              const handleClicked = () => {
                setSelected(kw);
                setOpenUpdate(true);
              };

              const handleDelete = () => {
                setSelected(kw);
                setOpenDelete(true);
              };

              return (
                <Chip
                  key={`${kw.name}-${index}`}
                  label={`${kw.name} | ${kw.weight}`}
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
      {openAdd && !disabled && <KeywordDialog keyword={undefined} open={openAdd} onClose={handleAddClosed} />}
      {openUpdate && !disabled && <KeywordDialog keyword={selected} open={openUpdate} onClose={handleUpdateClosed} />}
      {openDelete && !disabled && selected && (
        <ProjectKeywordDeleteDialog
          keyword={selected}
          open={openDelete}
          onOk={handleDeleteOk}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}
