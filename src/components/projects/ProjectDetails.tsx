import { createElement, FC, useEffect, useState } from 'react';
import { PropertiesGrid, PropertyChangers, PropertyInfo } from '@app/components/PropertiesGrid/PropertiesGrid';
import { PropertyChangerProps } from '@app/components/PropertyChanger/PropertyChanger';
import { projectPropertySchema } from './project-schema';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Alert, CircularProgress, Fab, Stack } from '@mui/material';
import { ProjectsService } from '@app/services/projects/ProjectsService';
import { ArrowBack } from '@mui/icons-material';
import { useProject } from '@app/hooks/useProject';
import { ProjectContextType } from '@app/pages/projects/ProjectPage';

// useOutletContext is used on this page, because the use can modify the project's name or shorthand
// If they are modified, the parent page has to know about it, therefore they share this context
export function ProjectDetails() {
    const params = useParams();
    const navigate = useNavigate();
    const { project, setProject: updateProject }: ProjectContextType = useOutletContext();
    const [open, setOpen] = useState(false);
    const [propInfo, setPropInfo] = useState<PropertyInfo<unknown>>({ propName: '', label: '' });
    const [saveError, setSaveError] = useState('');
    const [saving, setSaving] = useState(false);
    const { error, loading, project: reloadedProject, loadProject } = useProject(Number(params.projectId));

    // it is possible that the page was reloaded by the user, in this case the project must be retrieved from the backend
    useEffect(() => {
        loadProject();
        if (updateProject && reloadedProject) {
            console.log('using updated project');
            updateProject(reloadedProject);
        }
    }, []);

    const onPropChange = (propInfo: PropertyInfo<unknown>) => {
        setPropInfo(propInfo);
        setOpen(true);
    };

    const handleClose = <T extends unknown>(newValue?: T) => {
        const saveData = async () => {
            if (!newValue) {
                return;
            }

            try {
                if (!project || !updateProject) {
                    throw new Error('setProject is invalid');
                }

                const newValues: any = { ...project };
                newValues[propInfo.propName] = newValue;

                const modifiedProject = await ProjectsService.update(newValues);
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
        navigate('../..');
    };

    const propertyToElement = (propInfo: PropertyInfo<unknown>) => {
        if (!propInfo.propertyChanger) {
            throw Error('property changer is undefined');
        }

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

        return createElement<PropertyChangerProps<unknown>>(PropertyChangers[propInfo.propertyChanger] as FC, props);
    };

    if (loading || saving) {
        return <CircularProgress />;
    }

    if (error !== '' || saveError !== '') {
        return <Alert severity="error">{error}</Alert>;
    }

    const schema = projectPropertySchema(project);

    return (
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
    );
}
