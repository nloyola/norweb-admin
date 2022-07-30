import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { PeoplePage } from './pages/people/PeoplePage';
import { PersonPage } from './pages/people/PersonPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { ProjectPage } from './pages/projects/ProjectPage';
import { HomePage } from './pages/HomePage';
import { ProjectAddPage } from './pages/projects/ProjectAddPage';
import { Events } from './components/events/Events';
import { ProjectDetails } from './components/projects/ProjectDetails';
import { EventAdd } from './components/events/EventAdd';
import { EventDetails } from './components/events/EventDetails';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<HomePage />} />
                    <Route path="people">
                        <Route index element={<PeoplePage />} />
                        <Route path=":personId" element={<PersonPage />} />
                    </Route>
                    <Route path="projects">
                        <Route index element={<ProjectsPage />} />
                        <Route path="add" element={<ProjectAddPage />} />
                        <Route path=":projectId" element={<ProjectPage />}>
                            <Route index element={<ProjectDetails />} />
                            <Route path="events">
                                <Route index element={<Events />} />
                                <Route path="add" element={<EventAdd />} />
                                <Route path=":eventId" element={<EventDetails />} />
                            </Route>
                        </Route>
                    </Route>
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
        </BrowserRouter>
    </React.StrictMode>
);
