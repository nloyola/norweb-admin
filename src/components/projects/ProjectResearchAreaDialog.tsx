import { ProjectsApi } from '@app/api/ProjectsApi';
import { ResearchAreasApi } from '@app/api/ResearchAreasApi';
import { ResearchArea } from '@app/models/projects';
import {
  ProjectResearchArea,
  projectResearchAreaSchema,
  ProjectResearchAreaUpdate
} from '@app/models/projects/ProjectResearchArea';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  areaId: z.number()
});

export type ProjectResearchAreaFormInput = z.infer<typeof schema>;

type Option = {
  id: number;
  label: string;
};

/**
 * A component that allows the user to update a project researchArea.
 *
 * Opens a dialog box that allows the user to modify the researchArea settings.
 */
export const ProjectResearchAreaDialog: React.FC<{
  title: string;
  area?: ProjectResearchArea;
  open: boolean;
  onClose: (researchArea?: ProjectResearchAreaFormInput) => void;
}> = ({ title, area, open, onClose }) => {
  const params = useParams();
  const projectId = Number(params.projectId);

  const {
    control,
    getValues,
    formState: { isValid, errors }
  } = useForm<ProjectResearchAreaFormInput>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: { areaId: area?.researchAreaId }
  });

  const researchAreasQuery = useQuery(['researchAreas'], async () => ResearchAreasApi.list(), {
    keepPreviousData: true
  });

  const projectResearchAreasQuery = useQuery(
    ['project', projectId, 'allResearchAreas'],
    () => ProjectsApi.get(projectId).then((project) => project.researchAreas.map((pra) => pra.researchAreaId)),
    {
      keepPreviousData: true
    }
  );

  const handleOk = () => {
    onClose(getValues());
  };

  const handleCancel = () => {
    onClose();
  };

  if (researchAreasQuery.isLoading || projectResearchAreasQuery.isLoading || !open) {
    return <></>;
  }

  let selectedArea: ResearchArea | undefined;
  let selectedOption: Option | undefined;

  console.log(researchAreasQuery.data, projectResearchAreasQuery.data);

  let validResearchAreas: ResearchArea[] = [];
  if (researchAreasQuery.data && projectResearchAreasQuery.data) {
    // validResearchAreas are the ones not already selected for this project
    validResearchAreas = researchAreasQuery.data.filter((ra) => !projectResearchAreasQuery.data.includes(ra.id));
  }

  if (area) {
    selectedArea = researchAreasQuery.data?.find((a) => a.id === area.researchAreaId);
    if (selectedArea) {
      selectedOption = { id: selectedArea.id, label: selectedArea.name };
    }
  }

  return (
    <Dialog onClose={handleCancel} open={open} fullWidth={true} maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form>
          <Grid item xs={12} md={12}>
            <Controller
              name="areaId"
              control={control}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  defaultValue={selectedOption}
                  onChange={(_, data) => onChange(data?.id)}
                  options={(validResearchAreas || []).map((ra) => ({ id: ra.id, label: ra.name }))}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Research Area"
                      variant="standard"
                      error={!!errors.areaId}
                      helperText={errors.areaId ? errors.areaId?.message : ''}
                    />
                  )}
                />
              )}
            />
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk} disabled={!isValid}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
