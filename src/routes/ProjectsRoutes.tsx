import { Route, Routes } from 'react-router-dom';
import { ProjectsPage } from '@app/pages/projects/ProjectsPage';
import { ProjectPage } from '@app/pages/projects/ProjectPage';
import { ProjectAddPage } from '@app/pages/projects/ProjectAddPage';
import { EventsList } from '@app/components/events/EventsList';
import { ProjectDetails } from '@app/components/projects/ProjectDetails';
import { EventAdd } from '@app/components/events/EventAdd';
import { EventDetails } from '@app/components/events/EventDetails';

export default function ProjectsRoutes() {
  return (
    <Routes>
      <Route index element={<ProjectsPage />} />
      <Route path="add" element={<ProjectAddPage />} />
      <Route path=":projectId" element={<ProjectPage />}>
        <Route index element={<ProjectDetails />} />
        <Route path="events">
          <Route index element={<EventsList />} />
          <Route path="add" element={<EventAdd />} />
          <Route path=":eventId" element={<EventDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}
