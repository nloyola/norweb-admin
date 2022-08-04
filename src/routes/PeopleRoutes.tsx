import { Route, Routes } from 'react-router-dom';
import { PeoplePage } from '@app/pages/people/PeoplePage';
import { PersonPage } from '@app/pages/people/PersonPage';

export function PeopleRoutes() {
    return (
        <Routes>
            <Route index element={<PeoplePage />} />
            <Route path=":personId" element={<PersonPage />} />
        </Routes>
    );
}
