import { Link, RouteObject } from 'react-router-dom';
import App from './App';
import { EventAdd } from './components/events/EventAdd';
import { EventDetails } from './components/events/EventDetails';
import { Events } from './components/events/Events';
import { ProjectDetails } from './components/projects/ProjectDetails';
import { PeoplePage } from './pages/people/PeoplePage';
import { PersonPage } from './pages/people/PersonPage';
import { ProjectPage } from './pages/projects/ProjectPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';

function NoMatch() {
    return (
        <div>
            <h2>It looks like you're lost...</h2>
            <p>
                <Link to="/">Go to the home page</Link>
            </p>
        </div>
    );
}

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'people',
                children: [
                    {
                        element: <PeoplePage />
                    },
                    {
                        element: <PersonPage />
                    }
                ]
            },
            {
                path: 'projects',
                children: [
                    {
                        element: <ProjectsPage />
                    },
                    {
                        path: ':projectId',
                        element: <ProjectPage />,
                        children: [
                            {
                                element: <ProjectDetails />
                            },
                            {
                                path: 'events',
                                children: [
                                    {
                                        element: <Events />
                                    },
                                    {
                                        path: 'add',
                                        element: <EventAdd />
                                    },
                                    {
                                        path: ':eventId',
                                        element: <EventDetails />
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            { path: '*', element: <NoMatch /> }
        ]
    }
];
