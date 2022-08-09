import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout/DashboardLayout';
import { HomePage } from './pages/HomePage';
import { ProjectsRoutes } from './routes/ProjectsRoutes';
import { PeopleRoutes } from './routes/PeopleRoutes';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="people/*" element={<PeopleRoutes />} />
        <Route path="projects/*" element={<ProjectsRoutes />} />
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>No such page!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  );
}
