import React, { FC } from 'react';
import { Project } from '@app/models/projects';
import { Avatar, Box, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { stringAvatar } from '@app/utils/utils';
import { PropertyChangerProps } from '@app/components/PropertyChanger/PropertyChanger';
import ProjectsService from '@app/services/projects';
import { projectPropertySchema } from './project-schema';
import PropertiesGrid from '@app/components/PropertiesGrid';
import { PropertyChangers, PropertyInfo } from '@app/components/PropertiesGrid/PropertiesGrid';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ProjectEventsTab from './ProjectEventsTab';

type ProjectDetailsProps = {
    project: Project;
};

const saveProject = async (project: Project): Promise<Project> => {
    try {
        const reply = await new ProjectsService().update(project);
        return reply;
    } catch (e) {
        console.error(e);
        return null;
    }
};

interface DetailsState<T> {
    open: boolean;
    project: Project;
    propInfo: PropertyInfo<T>;
    tab: string;
}

const ProjectDetails = ({ project: proj }: ProjectDetailsProps) => {
    if (!proj.id) {
        throw new Error('project is invalid');
    }

    const [state, setState] = React.useState<DetailsState<unknown>>({
        open: false,
        project: proj,
        propInfo: { propName: '', label: '' },
        tab: '1'
    });

    const handleTabChange = (_event: React.SyntheticEvent, newTab: string) => {
        setState({
            ...state,
            tab: newTab
        });
    };

    const onPropChange = (propInfo: PropertyInfo<unknown>) => {
        setState({
            ...state,
            open: true,
            propInfo
        });
    };

    const handleClose = <T extends unknown>(newValue?: T) => {
        if (newValue === null) {
            setState({ ...state, open: false });
            return;
        }

        state.project[state.propInfo.propName] = newValue;
        saveProject(state.project).then((p) => setState({ ...state, open: false, project: p }));
    };

    const propertyToElement = (propInfo: PropertyInfo<unknown>) => {
        if (PropertyChangers[propInfo.propertyChanger] === undefined) {
            throw Error(`property changer is invalid: ${propInfo.propertyChanger}`);
        }

        const props: PropertyChangerProps<unknown> = {
            title: 'Change Project Settings',
            id: propInfo.propName,
            label: propInfo.label,
            open: state.open,
            onClose: handleClose,
            ...propInfo.changerPropsExtra
        };

        return React.createElement<PropertyChangerProps<unknown>>(
            PropertyChangers[propInfo.propertyChanger] as FC,
            props
        );
    };

    return (
        <Stack spacing={2}>
            <Paper
                sx={{
                    p: 3
                }}
            >
                <Stack spacing={1}>
                    <Stack spacing={1} direction="row">
                        <Avatar {...stringAvatar(state.project.name)}></Avatar>
                        <Stack spacing={0}>
                            <Typography component="h1" variant="h3">
                                {state.project.name}
                            </Typography>
                            <Typography component="h2" variant="subtitle1">
                                {state.project.shorthand}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    <TabContext value={state.tab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="project-tabs">
                                <Tab label="Settings" value="1" />
                                <Tab label="Events" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <PropertiesGrid schema={projectPropertySchema(state.project)} handleChange={onPropChange} />
                        </TabPanel>
                        <TabPanel value="2">
                            <ProjectEventsTab project={state.project} />
                        </TabPanel>
                    </TabContext>
                </Stack>
            </Paper>
            {state.open && propertyToElement(state.propInfo)}
        </Stack>
    );
};

export default ProjectDetails;
