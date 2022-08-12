import { ProjectKeyword, ProjectKeywordUpdate } from '@app/models/projects/ProjectKeyword';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { Alert, Button, Chip, CircularProgress, Grid, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectKeywordDeleteDialog } from './ProjectKeywordDeleteDialog';
import { KeywordDialog, KeywordFormInput } from './KeywordDialog';

type KeywordsProps = {
  initialKeywords: ProjectKeyword[];
};

/**
 * A component that allows the user to add, update and delete keywords from a Project.
 */
export function Keywords({ initialKeywords }: KeywordsProps) {
  const params = useParams();
  const projectId = Number(params.projectId);

  const [keywords, setKeywords] = useState<ProjectKeywordUpdate[]>(initialKeywords || []);
  const [selected, setSelected] = useState<ProjectKeywordUpdate | undefined>(undefined);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [backendReqPending, setBackendReqPending] = useState(false);
  const [backendError, setBackendError] = useState('');

  const handleAdd = () => {
    setOpenAdd(true);
  };

  const handleAddClosed = (newKeyword?: KeywordFormInput) => {
    setOpenAdd(false);
    if (!newKeyword) {
      return;
    }

    const addKeyword = async () => {
      try {
        const modifiedProject = await ProjectsService.addKeyword(projectId, newKeyword);
        setKeywords(modifiedProject.keywords);
      } catch (err) {
        console.error(err);
        setBackendError(err instanceof Error ? err.message : JSON.stringify(err));
      } finally {
        setBackendReqPending(false);
      }
    };

    addKeyword();
  };

  const handleUpdateClosed = (updatedKeyword?: KeywordFormInput) => {
    setOpenUpdate(false);
    if (!updatedKeyword) {
      return;
    }

    const updateKeyword = async () => {
      if (!selected) {
        throw new Error('selected is invalid');
      }

      try {
        const modifiedProject = await ProjectsService.updateKeyword(projectId, {
          ...selected,
          ...updatedKeyword
        });
        setKeywords(modifiedProject.keywords);
      } catch (err) {
        console.error(err);
        setBackendError(err instanceof Error ? err.message : JSON.stringify(err));
      } finally {
        setBackendReqPending(false);
      }
    };

    updateKeyword();
  };

  const handleDeleteOk = () => {
    setOpenDelete(false);
    if (!selected) {
      return;
    }

    const deleteKeyword = async () => {
      try {
        const modifiedProject = await ProjectsService.deleteKeyword(projectId, selected.id);
        setKeywords(modifiedProject.keywords);
      } catch (err) {
        console.error(err);
        setBackendError(err instanceof Error ? err.message : JSON.stringify(err));
      } finally {
        setBackendReqPending(false);
      }
    };

    deleteKeyword();
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  if (backendReqPending) {
    return <CircularProgress />;
  }

  if (backendError !== '') {
    return <Alert severity="error">{backendError}</Alert>;
  }

  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="flex-start">
      <Grid item xs>
        <Box>
          {keywords.map((kw, index) => {
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
      <Grid item>
        <Button size="small" variant="outlined" onClick={handleAdd}>
          Add
        </Button>
      </Grid>
      {openAdd && <KeywordDialog keyword={undefined} open={openAdd} onClose={handleAddClosed} />}
      {openUpdate && <KeywordDialog keyword={selected} open={openUpdate} onClose={handleUpdateClosed} />}
      {openDelete && selected && (
        <ProjectKeywordDeleteDialog
          keyword={selected}
          open={openDelete}
          onOk={handleDeleteOk}
          onCancel={handleDeleteCancel}
        />
      )}
    </Grid>
  );
}
