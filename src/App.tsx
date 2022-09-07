import { Alert, CircularProgress } from '@mui/material';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout/DashboardLayout';
import { HomePage } from './pages/HomePage';
import ResearchAreasRoutes from './routes/ResearchAreasRoutes';

const PeopleRoutes = lazy(() => import('./routes/PeopleRoutes'));
const ProjectsRoutes = lazy(() => import('./routes/ProjectsRoutes'));
const FundersRoutes = lazy(() => import('./routes/FundersRoutes'));

const PeopleRoutesLazy = () => (
  <Suspense fallback={<CircularProgress />}>
    <PeopleRoutes />
  </Suspense>
);

const ProjectsRoutesLazy = () => (
  <Suspense fallback={<CircularProgress />}>
    <ProjectsRoutes />
  </Suspense>
);

const FundersRoutesLazy = () => (
  <Suspense fallback={<CircularProgress />}>
    <FundersRoutes />
  </Suspense>
);

const ResearchAreasRoutesLazy = () => (
  <Suspense fallback={<CircularProgress />}>
    <ResearchAreasRoutes />
  </Suspense>
);

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="people/*" element={<PeopleRoutesLazy />} />
        <Route path="projects/*" element={<ProjectsRoutesLazy />} />
        <Route path="funders/*" element={<FundersRoutesLazy />} />
        <Route path="research-areas/*" element={<ResearchAreasRoutesLazy />} />
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <Alert severity="error">No such page!</Alert>
            </main>
          }
        />
      </Route>
    </Routes>
  );
}
