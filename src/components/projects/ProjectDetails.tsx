import { createElement, useContext, useState } from 'react';
import { ProjectContext } from '@app/pages/projects/ProjectPage';
import { PropertiesGrid, PropertyChangers, PropertyInfo } from '@app/components/PropertiesGrid/PropertiesGrid';
import { PropertyChangerProps } from '@app/components/PropertyChanger/PropertyChanger';
import { projectPropertySchema } from './project-schema';
import { useNavigate } from 'react-router-dom';
import { Alert, CircularProgress, Fab, Stack } from '@mui/material';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { ArrowBack } from '@mui/icons-material';

export function ProjectDetails() {
    const navigate = useNavigate();
    const { project, setProject } = useContext(ProjectContext);
    const [open, setOpen] = useState(false);
    const [propInfo, setPropInfo] = useState<PropertyInfo<unknown>>({ propName: '', label: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    if (project === undefined || project.name === undefined) {
        navigate('../');
    }

    const schema = projectPropertySchema(project);

    const onPropChange = (propInfo: PropertyInfo<unknown>) => {
        setPropInfo(propInfo);
        setOpen(true);
    };

    const handleClose = <T extends unknown>(newValue?: T) => {
        const saveData = async () => {
            if (newValue === null) {
                return;
            }

            try {
                const newValues: any = { ...project };
                newValues[propInfo.propName] = newValue;

                const modifiedProject = await ProjectsService.update(newValues);
                setProject(modifiedProject);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : JSON.stringify(err));
            } finally {
                setSaving(false);
            }
        };

        setOpen(false);
        saveData();
    };

    const backClicked = () => {
        navigate('../..');
    };

    const propertyToElement = (propInfo: PropertyInfo<unknown>) => {
        if (PropertyChangers[propInfo.propertyChanger] === undefined) {
            throw Error(`property changer is invalid: ${propInfo.propertyChanger}`);
        }

        const props: PropertyChangerProps<unknown> = {
            title: 'Change Project Settings',
            id: propInfo.propName,
            label: propInfo.label,
            open: open,
            onClose: handleClose,
            ...propInfo.changerPropsExtra
        };

        return createElement<PropertyChangerProps<unknown>>(PropertyChangers[propInfo.propertyChanger], props);
    };

    return (
        <>
            {saving && <CircularProgress />}
            {!saving && error !== '' && <Alert severity="error">Error in backend adding a project: {error}</Alert>}
            {!saving && error === '' && (
                <>
                    <PropertiesGrid schema={schema} handleChange={onPropChange} />
                    <Stack spacing={2} direction="row" mt={5}>
                        <Fab color="primary" size="small" aria-label="add" variant="extended" onClick={backClicked}>
                            <ArrowBack sx={{ mr: 1 }} />
                            Back
                        </Fab>
                    </Stack>
                    {open && propertyToElement(propInfo)}
                </>
            )}
        </>
    );
}
