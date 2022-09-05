import { PropertyChanger } from '@app/components/PropertyChanger/PropertyChanger';
import { useProject } from '@app/hooks/useProject';
import { CountryNames, statusToLabel } from '@app/models';
import { Project } from '@app/models/projects';
import { ProjectsApi } from '@app/api/ProjectsApi';
import { nlToFragments } from '@app/utils/nltoFragments';
import { datesRangeToString } from '@app/utils/utils';
import { ArrowBack } from '@mui/icons-material';
import { CircularProgress, Fab, Grid, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityProperty } from '../EntityProperty';
import { DateRange } from '../PropertyChanger';
import { ShowError } from '../ShowError';
import { enqueueEntitySavedSnackbar } from '../SnackbarCloseButton';
import { Keywords } from './Keywords';
import { projectPropertiesSchemas } from './projectPropertiesSchema';
import { KeyResearchArea } from './KeyResearchArea';
import { ProjectResearchAreas } from './ProjectResearchAreas';

/**
 * A component that shows a project's settings and allows the user to modify them.
 */
export function ProjectDetails() {
  const params = useParams();
  const projectId = Number(params.projectId);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null);
  const { error, isError, isLoading, isFetching, data: project } = useProject(projectId);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const updateProject = useMutation((project: Project) => ProjectsApi.update(project), {
    onSuccess: (newProject: Project) => {
      queryClient.setQueryData(['projects', projectId], newProject);
      queryClient.invalidateQueries(['projects']);
      enqueueEntitySavedSnackbar(enqueueSnackbar, 'The project was updated');
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

    if (!project) {
      throw new Error('project is invalid');
    }

    const newValues = { ...project };

    if (propertyName === 'duration') {
      const newDates = newValue as DateRange;
      newValues.startDate = newDates.startDate;
      newValues.endDate = newDates.endDate;
    } else {
      // see https://bobbyhadz.com/blog/typescript-create-type-from-object-keys
      newValues[propertyName as keyof Project] = newValue as keyof Project[keyof Project];
    }

    updateProject.mutate(newValues);
  };

  const backClicked = () => {
    navigate('../../');
  };

  if (isError) {
    return <ShowError error={error} />;
  }

  if (updateProject.isError) {
    return <ShowError error={updateProject.error} />;
  }

  if (isLoading || !project) {
    return <CircularProgress />;
  }

  const schemas = projectPropertiesSchemas(project);

  return (
    <>
      <Grid container spacing={4}>
        <EntityProperty propName="name" label="Project Name" value={project.name} handleChange={onPropChange} />
        <EntityProperty propName="shorthand" label="Shorthand" value={project.shorthand} handleChange={onPropChange} />
        <EntityProperty
          propName="description"
          label="Description"
          value={nlToFragments(project.description)}
          handleChange={onPropChange}
        />
        <EntityProperty propName="keyResearchArea" label="Key Research Area" value={<KeyResearchArea />} />
        <EntityProperty propName="researchAreas" label="Other Research Areas" value={<ProjectResearchAreas />} />
        <EntityProperty
          propName="duration"
          label="Duration"
          value={datesRangeToString(project.startDate, project.endDate)}
          handleChange={onPropChange}
        />
        <EntityProperty
          propName="goals"
          label="Goals"
          value={project.goals ? nlToFragments(project.goals) : null}
          handleChange={onPropChange}
        />
        <EntityProperty
          propName="vision"
          label="Vision"
          value={project.vision ? nlToFragments(project.vision) : null}
          handleChange={onPropChange}
        />
        <EntityProperty propName="keywords" label="Keywords" value={<Keywords initialKeywords={project.keywords} />} />
        <EntityProperty
          propName="countryCode"
          label="Country"
          value={project.countryCode ? CountryNames[project.countryCode] : null}
          handleChange={onPropChange}
        />
        <EntityProperty
          propName="status"
          label="Status"
          value={project.status ? statusToLabel(project.status) : undefined}
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
          title={'Project: change settings'}
          {...schemas[propertyToUpdate]}
          open={open}
          onClose={handleClose}
        />
      )}
    </>
  );
}
