import { Route, Routes } from 'react-router-dom';
import { ProjectsPage } from '@app/pages/projects/ProjectsPage';
import { ProjectPage } from '@app/pages/projects/ProjectPage';
import { ProjectAddPage } from '@app/pages/projects/ProjectAddPage';
import { EventsList } from '@app/components/events/EventsList';
import { ProjectDetails } from '@app/components/projects/ProjectDetails';
import { EventAddForm } from '@app/components/events/EventAddForm';
import { EventDetails } from '@app/components/events/EventDetails';
import { ProjectFundersList } from '@app/components/projects/ProjectFundersList';
import { ProjectFunderAddForm } from '@app/components/projects/ProjectFunderAddForm';
import { ProjectFunderDetails } from '@app/components/projects/ProjectFunderDetails';
import { ProjectMilestonesList } from '@app/components/projects/ProjectMilestonesList';

export default function ProjectsRoutes() {
  return (
    <Routes>
      <Route index element={<ProjectsPage />} />
      <Route path="add" element={<ProjectAddPage />} />
      <Route path=":projectId" element={<ProjectPage />}>
        <Route index element={<ProjectDetails />} />
        <Route path="funders">
          <Route index element={<ProjectFundersList />} />
          <Route path="add" element={<ProjectFunderAddForm />} />
          <Route path=":funderId" element={<ProjectFunderDetails />} />
        </Route>
        <Route path="events">
          <Route index element={<EventsList />} />
          <Route path="add" element={<EventAddForm />} />
          <Route path=":eventId" element={<EventDetails />} />
        </Route>
        <Route path="milestones">
          <Route index element={<ProjectMilestonesList />} />
        </Route>
      </Route>
    </Routes>
  );
}
