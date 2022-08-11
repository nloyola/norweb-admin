import { useEffect, useState } from 'react';
import { PropertyChanger } from '@app/components/PropertyChanger/PropertyChanger';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Alert, CircularProgress, Fab, Grid, Stack, Typography } from '@mui/material';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { ArrowBack } from '@mui/icons-material';
import { useProject } from '@app/hooks/useProject';
import { ProjectContextType } from '@app/pages/projects/ProjectPage';
import { DateRange } from '../PropertyChanger';
import { Keywords } from './Keywords';
import { datesRangeToString, dateToString } from '@app/utils/utils';
import { EntityProperty } from '../EntityProperty';
import { countryCodeToName as countryCodeToName, statusToLabel } from '@app/models';
import { projectPropertiesSchemas } from './projectPropertiesSchema';
import { nlToFragments } from '@app/utils/nltoFragments';

/**
 * A component that shows a project's settings and allows the user to modify them.
 *
 * useOutletContext is used on this page, because the user can modify the project's name or shorthand.
 * If they are modified, the parent page has to know about it, therefore they share this context.
 */
export function ProjectDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { project, updateProject }: ProjectContextType = useOutletContext();
  const [open, setOpen] = useState(false);
  const [propertyToUpdate, setPropertyToUpdate] = useState<string | null>(null);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const { error, loading, project: reloadedProject, loadProject } = useProject(Number(params.projectId));

  // it is possible that the page was reloaded by the user, in this case the project must be retrieved from the backend
  useEffect(() => {
    loadProject();
    if (updateProject && reloadedProject) {
      updateProject(reloadedProject);
    }
  }, []);

  const onPropChange = (propertyName: string) => {
    setPropertyToUpdate(propertyName);
    setOpen(true);
  };

  const handleClose = <T extends unknown>(propertyName: string, newValue?: T) => {
    const saveData = async () => {
      if (!newValue) {
        return;
      }

      if (!project || !updateProject) {
        throw new Error('setProject is invalid');
      }

      const newValues: any = { ...project };

      if (propertyName === 'duration') {
        const newDates = newValue as DateRange;
        newValues.startDate = newDates.startDate;
        newValues.endDate = newDates.endDate;
      } else {
        newValues[propertyName] = newValue;
      }

      try {
        const modifiedProject = await ProjectsService.update({
          id: project.id,
          version: project.version,
          name: newValues.name,
          shorthand: newValues.shorthand,
          startDate: dateToString(newValues.startDate),
          endDate: dateToString(newValues.endDate),
          description: newValues.description,
          goals: newValues.goals,
          vision: newValues.vision,
          countryCode: newValues.countryCode,
          status: newValues.status
        });
        updateProject(modifiedProject);
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

  if (loading || saving) {
    return <CircularProgress />;
  }

  if (error !== '') {
    return <Alert severity="error">{error}</Alert>;
  }

  if (saveError !== '') {
    return <Alert severity="error">{saveError}</Alert>;
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
        <EntityProperty
          propName="duration"
          label="Duration"
          value={datesRangeToString(
            new Date(project.startDate),
            project.endDate ? new Date(project.endDate) : undefined
          )}
          handleChange={onPropChange}
        />
        <EntityProperty
          propName="goals"
          label="Goals"
          value={nlToFragments(project.goals)}
          handleChange={onPropChange}
        />
        <EntityProperty
          propName="vision"
          label="Vision"
          value={nlToFragments(project.vision)}
          handleChange={onPropChange}
        />
        <EntityProperty propName="keywords" label="Keywords" value={<Keywords initialKeywords={project.keywords} />} />
        <EntityProperty
          propName="countryCode"
          label="Country"
          value={project.countryCode ? countryCodeToName(project.countryCode) : undefined}
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
