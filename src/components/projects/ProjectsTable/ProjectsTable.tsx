import { IProject, Project } from '@app/models/projects';
import { stringAvatar } from '@app/utils/utils';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Avatar,
    Box
} from '@mui/material';
import Link from 'next/link';

type ProjectsTableProps = {
    projects: IProject[];
};

const ProjectsTable = ({ projects }: ProjectsTableProps) => {
    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="projects" sx={{ minWidth: 300 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map((p, index) => {
                        const project = new Project().deserialize(p);
                        return (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            gap: 1
                                        }}
                                    >
                                        <Avatar {...stringAvatar(project.name, 10, 24, 24)}></Avatar>
                                        {project.name}
                                    </Box>
                                </TableCell>
                                <TableCell>{project.startDate.toLocaleDateString()}</TableCell>
                                <TableCell>{project.endDate.toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <Link href={`/projects/${project.id}`}>
                                        <Button size="small" variant="outlined">
                                            View
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProjectsTable;
